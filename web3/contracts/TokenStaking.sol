//SPDX-License-Identifier:MIT
// moi 156 +++   video   7:23:32
pragma solidity^0.8.0;
import "./Ownable.sol";
import "./ReentrancyGuard.sol";
import "./Initializable.sol";
import "./IERC20.sol";
contract TokenStaking is Ownable,ReentrancyGuard,Initializable{
struct User{
    uint stakeAmount;
    uint rewardAmount;
    uint lastStakeTime;
    uint lastRewardCalculationTime;
    uint rewardsClaimedSoFar;
}
uint _minimumStakingAmount;
uint _maxStakeTokenLimit;
uint _stakeEndDate;
uint _stakeStarDate;
uint _totalStakedTokens;
uint _totalUsers;
uint _stakeDays;
uint _earlyUnstakeFeePercentage;
bool _isStakingPaused;
address private _tokenAddress;
uint _apyRate;
uint public constant PERCENTAGE_DENOMINATOR=10000;
uint public constant APY_RATE_CHANGE_THRESHOLD=10;
mapping(address=>User)private _users;
event Stake(address indexed user,uint amount);
event UnStake(address indexed user,uint amount);
event EarlyUnstakeFee(address indexed user,uint amount);
event ClaimReward(address indexed user,uint amount);
modifier whenTreasuryHasBalance(uint amount){
    require(
        IERC20(_tokenAddress).balanceOf(address(this))>=amount,
        "TokenStaking:insufficient funds in the treasury"
    );
    _;   
}
function initialize(address owner_,address tokenAddress_,
uint apyRate_,
uint minimumStakingAmount_,
uint maxStakeTokenLimit_,
uint stakeStarDate_,
uint stakeEndDate_,uint stakeDays_,uint earlyUnstakeFeePercentage_)public virtual initializer {
 __TokenStaking_init_unchained(owner_,tokenAddress_,apyRate_,minimumStakingAmount_,
 maxStakeTokenLimit_,stakeStarDate_,stakeEndDate_,stakeDays_,earlyUnstakeFeePercentage_);}
function __TokenStaking_init_unchained(
    address owner_,address tokenAddress_,uint apyRate_,
    uint minimumStakingAmount_,uint maxStakeTokenLimit_,uint stakeStarDate_,
    uint stakeEndDate_,uint stakeDays_,uint earlyUnstakeFeePercentage_)
    internal onlyInitializing{
    require(_apyRate<=1000000,"tokenStaking:apy rate should be less than 10000");
    require (stakeDays_>0,"TokenStaking:stake days must be non-zero");
    require (tokenAddress_!=address(0),"TokenStaking:token address can not be 0");
    require (stakeStarDate_<stakeEndDate_,"TokenStaking start date must be");
    _transferOwnership(owner_);
    _tokenAddress=tokenAddress_;
    _apyRate=apyRate_;
    _minimumStakingAmount=minimumStakingAmount_;
    _maxStakeTokenLimit=maxStakeTokenLimit_;
    _stakeStarDate=stakeStarDate_;
    _stakeEndDate=stakeEndDate_;
    _stakeDays=stakeDays_*1 days;
    _earlyUnstakeFeePercentage=earlyUnstakeFeePercentage_;
 }
 function getMinimumStakingAmount()external view returns (uint){
    return _minimumStakingAmount;
 }
 function getMaxStakingTokenLimit()external view returns(uint){
    return _maxStakeTokenLimit;
 }
function getStakeStarDate()external view returns (uint){
    return _stakeStarDate;
}
function getStakeEndDate() external view returns(uint){
    return _stakeEndDate;
}
function getTotalStakedTokens()external view returns (uint){
    return _totalStakedTokens;
}
function getTotalUSers()external view returns(uint){
    return _totalUsers;
}
function getStakeDays()external view returns(uint){
    return _stakeDays;
}
function getEarlyUnstakeFeePercentage()external view returns(uint){
    return _earlyUnstakeFeePercentage;
}
function getStakingStatus()external view returns(bool){
    return _isStakingPaused;
}

function getAPY()external view returns(uint){
    return _apyRate;
}
function getUserEstimatedRewards()external view returns(uint){
    (uint amount,)=_getUserEstimatedRewards(msg.sender);
    return _users[msg.sender].rewardAmount+amount;
}
function getWithdrawableAmount()external view returns(uint){
    return IERC20(_tokenAddress).balanceOf(address(this))-_totalStakedTokens;
}
function getUser(address userAddress)external view returns(User memory){
return _users[userAddress];
}
function isStakeHolder(address _user)external view returns(bool){
    return _users[_user].stakeAmount !=0;
}
function updateMinimumStakingAmount(uint newAmount)external onlyOwner{
    _minimumStakingAmount=newAmount;
}
function updateMaximumStakingAmount(uint newAmount)external onlyOwner{
    _maxStakeTokenLimit=newAmount;
}
function updateStakingEndDate(uint newDate)external onlyOwner{
    _stakeEndDate=newDate;
}
function updateEarlyUnstakeFeePercentage(uint newPercentage)external onlyOwner{
    _earlyUnstakeFeePercentage=newPercentage;
}
function stakeForUSer(uint amount,address user)external onlyOwner nonReentrant{
   _stakeTokens(amount,user); 
}
function toggleStakingStatus()external onlyOwner{
    _isStakingPaused=!_isStakingPaused;
}
function withdraw(uint amount)external onlyOwner nonReentrant{
    require(this.getWithdrawableAmount()>=amount,"TokenStaking:not enough withdrrawable tokens");
    IERC20(_tokenAddress).transfer(msg.sender,amount);

}
function stake(uint _amount)external nonReentrant{
    _stakeTokens(_amount,msg.sender);
}
function _stakeTokens(uint _amount,address user_)private{
    require(!_isStakingPaused,"TokenStaking:staking is paused");
    uint currentTime=getCurrentTime();
    require(currentTime>_stakeStarDate,"TokenStaking:staking not startes yet");
    require(currentTime<_stakeEndDate,"TokenStaking:staking ended"); 
    require(_totalStakedTokens+_amount<=_maxStakeTokenLimit,"TokenStaking:max staking token limit reached");
    require(_amount>0,"TokenStaking:stake amount must be non-zero");
    require(_amount>=_minimumStakingAmount,"TokenStaking:stake amount must greater than minimum amount allowed");
    if(_users[user_].stakeAmount!=0){
        _calculateRewards(user_);
    }else{
        _users[user_].lastRewardCalculationTime=currentTime;
        _totalUsers+=1;
    }
    _users[user_].stakeAmount+=_amount;
    _users[user_].lastStakeTime=currentTime;
    _totalStakedTokens+=_amount;
    require(IERC20(_tokenAddress).transferFrom(msg.sender,address(this),_amount),"TokenStaking:failed to transfer tokens");
    emit Stake(user_,_amount); }   
    function unstake(uint _amount)external nonReentrant 
    whenTreasuryHasBalance(_amount){
        address user=msg.sender;
        require(_amount!=0,"TokenStaking:amount should be non-zero");
        require(this.isStakeHolder(user),"TokenStaking:not enough stake to unstake");
        require(_users[user].stakeAmount>=_amount,"TokenStaking:not enough stake to unstake");
        _calculateRewards(user);
        uint feeEarlyUnstake;
        if(getCurrentTime()<=_users[user].lastStakeTime+_stakeDays){
        feeEarlyUnstake=((_amount*_earlyUnstakeFeePercentage/PERCENTAGE_DENOMINATOR));
        emit EarlyUnstakeFee(user,feeEarlyUnstake);
        }
        uint amountToUnstake=_amount-feeEarlyUnstake;
        _users[user].stakeAmount-=_amount;
        _totalStakedTokens-=_amount;
        if(_users[user].stakeAmount==0){
            _totalUsers-=1;
        }
        require(IERC20(_tokenAddress).transfer(user,amountToUnstake),"TokenStaking: failed to transfer");
        emit UnStake(user,_amount);
    }
    function claimReward()external nonReentrant whenTreasuryHasBalance(_users[msg.sender].rewardAmount){
        _calculateRewards(msg.sender);
        uint rewardAmount=_users[msg.sender].rewardAmount;
        require(rewardAmount>0,"TokenStaking,no reward to claim");
        require(IERC20(_tokenAddress).transfer(msg.sender,rewardAmount),"TokenStaking:failed to transfer");
    _users[msg.sender].rewardAmount=0;
    _users[msg.sender].rewardsClaimedSoFar+=rewardAmount;
    emit ClaimReward(msg.sender,rewardAmount);
    }
    function _calculateRewards(address _user)private{
        (uint userReward,uint currentTime)=_getUserEstimatedRewards(_user);
        _users[_user].rewardAmount+=userReward;
        _users[_user].lastRewardCalculationTime=currentTime;
    }
    function _getUserEstimatedRewards(address _user)private view returns(uint,uint){
        uint userReward;
        uint userTimestamp=_users[_user].lastRewardCalculationTime;
        uint currentTime=getCurrentTime();
        if(currentTime>_users[_user].lastStakeTime+_stakeDays){
            currentTime=_users[_user].lastStakeTime+_stakeDays;
        }
        uint totalStakedTime=currentTime-userTimestamp;
         userReward += ((totalStakedTime * _users[_user].stakeAmount * _apyRate) / (365 days)) / PERCENTAGE_DENOMINATOR;
          return(userReward,currentTime);
    }
    function getCurrentTime()internal  view virtual returns(uint){
        return block.timestamp;
    }
}

