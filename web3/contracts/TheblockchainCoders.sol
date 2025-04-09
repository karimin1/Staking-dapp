//SPDX-License-Identifier:MIT
pragma solidity^0.8.0;
contract  Theblockchaincoders{
    string public name="@theblockchaincoders";
    string public symbol="TBC";
    string public standard="theblockchaincoders v.0.1";
    uint public  totalSupply;
    address public ownerOfContract;
    uint public _userId;
    uint constant initialSupply=1000000*(10**18);
    address[]public holderToken;
    event Transfer(address indexed _from,address _to,uint _value);
    event Approval(address indexed _owner,address indexed _spender,uint _value);
    mapping (address=>TokenHolderInfo)public tokenHolderInfos;
    struct TokenHolderInfo{
        uint _tokenId;
        address _from;
        address _to;
        uint _totalToken;
        bool _tokenHolder;
    }
    mapping(address=>uint)public balanceOf;
    mapping(address=>mapping(address=>uint))public allowance;
    constructor(){
        ownerOfContract=msg.sender;
        balanceOf[msg.sender]=initialSupply;
        totalSupply=initialSupply;
    }
    function inc()internal{
        _userId ++;
    }
    function transfer(address _to,uint _value)public returns(bool success){
         require(balanceOf[msg.sender]>=_value,"insufficient balance");
        inc();
        balanceOf[msg.sender]-=_value;
        balanceOf[_to]+=_value;      
        TokenHolderInfo storage tokenHolderInfo=tokenHolderInfos[_to];    
        tokenHolderInfo._to= _to;
        tokenHolderInfo._from=msg.sender;
        tokenHolderInfo._totalToken=_value;
        tokenHolderInfo._tokenHolder=true;
        tokenHolderInfo._tokenId=_userId;
        holderToken.push(_to);
        emit Transfer(msg.sender, _to, _value);
        return true;

    }
    function approve(address _spender,uint _value)public returns(bool success){
        allowance[msg.sender][_spender]=_value;
        emit Approval(msg.sender,_spender, _value);
        return true;
    }
    function transferFrom(address _from,address _to,uint _value)public returns(bool success){
        require(_value<=balanceOf[_from]);
        require(_value<=allowance[_from][msg.sender]);
        balanceOf[_from]-=_value;
        balanceOf[_to]+=_value;
        allowance[_from][msg.sender]-=_value;
        emit Transfer(_from,_to,_value);
        return true;
    }
    function getTokenHolderData(address _address)public view returns(uint,address,address,uint,bool){
        return(
            tokenHolderInfos[_address]._tokenId,
            tokenHolderInfos[_address]._to,
            tokenHolderInfos[_address]._from,
            tokenHolderInfos[_address]._totalToken,
            tokenHolderInfos[_address]._tokenHolder
        );
    }
        function getTokenHolder()public view returns(address[] memory){
            return holderToken;
        }
}


