//FUNCTION CALL

loadInitialData('sevenDays');
connectMe("metamask_wallet");
function connectWallet(){}
function openTab(event,name){
    console.log(name);
    contractCall=name;
    getSelectedTab(name);
    loadInitialData(name);
}
async function loadInitialData(sClass){
    console.log(sClass);
    try{
                clearInterval(countDownGlobal);
                //const web3 = new Web3(window.ethereum);
                //console.log('Web3 instance:', web3);
                //console.log("STAKING ABI",SELECT_CONTRACT[_NETWORK_ID].STAKING);  // Add this line
                //console.log("STACKING NETWORK ID",SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass]); 
               // console.log(SELECT_CONTRACT[_NETWORK_ID].STACKING);
                let cObj=new web3Main.eth.Contract(
                    SELECT_CONTRACT[_NETWORK_ID].STACKING.abi,
                    SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address
                );
                //console.log("cObj",cObj);
                //ID ELEMENT DATA
                    // Attempt to get total users
                    let totalUsers;
try {
    totalUsers = await cObj.methods.getTotalUSers().call();
    console.log('Total Users:', totalUsers);
} catch (error) {
    console.error('Error getting total users:', error);
}
                    let cApy = await cObj.methods.
                    getAPY().call();
                    console.log('cApy', cApy);

                    // Attempt to get APY

                
                    // Continue with the rest of your code...
                    // Log any errors that occur
                   // console.error('Error occurred:', error);
                let userDetail=await cObj.methods.getUser(currentAddress).call();
                console.log('userDetail', userDetail);
                const user={
                    lastRewardCalculationTime:userDetail.latRewardCalculationTime,
                    lastStakeTime:userDetail.lastStakeTime,
                    rewardAmount:userDetail.rewardAmount,
                    rewardsClaimedSoFar:userDetail.rewardsClaimedSoFar,
                    stakeAmount:userDetail.stakeAmount,
                    address:currentAddress,
                };
                localStorage.setItem("User",JSON.stringify(user));
                let userDetailBal=userDetail.stakeAmount/10**18;
                console.log('userDetailBal', userDetailBal);
    document.getElementById("total-locked-user-token").innerHTML=`${userDetailBal}`;
    document.getElementById("num-of-stackers-value").innerHTML=`${totalUsers}`;
    document.getElementById("apy-value-feature").innerHTML=`${cApy}%`;
    let totalLockedTokens=await cObj.methods.getTotalStakedTokens().call();
    let earlyUnstakeFee=await cObj.methods.getEarlyUnstakeFeePercentage().call();
    //ELEMENT --CLASS1
    document.getElementById("total-locked-tokens-value").innerHTML=`${
        totalLockedTokens/10**18
    }${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;
   
    document.querySelectorAll(".early-unstake-fee-value")
    .forEach(function(element){
        element.innerHTML=`${(earlyUnstakeFee)/100}%`;
    });
   // console.log('(earlyUnstakeFee)/100',(earlyUnstakeFee)/100);
    let minStakeAmount=await cObj.methods.getMinimumStakingAmount().call();
    console.log("minStakeAmount",minStakeAmount);
    minStakeAmount=Number(minStakeAmount);
    let minA;
    if(minStakeAmount){
        minA=`${(minStakeAmount/10**18).toLocaleString()}${
            SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol
        }`;
    }else{
        minA="N/A";
    }
    document.querySelectorAll(".Minimum-Staking-Amount").forEach(function(element){
        element.innerHTML=`${minA}`;
    });
    document.querySelectorAll(".Maximum-Staking-Amount").forEach(function(element){
        element.innerHTML=`${(5000).toLocaleString()} ${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;
    });
    let isStakingPaused=await cObj.methods.getStakingStatus().call();
    console.log('isStakingPaused',isStakingPaused);
    let isStakingPausedText;
    let startDate=await cObj.methods.getStakeStarDate().call();
    startDate=Number(startDate)*1000;
    let endDate=await cObj.methods.getStakeEndDate().call();
    endDate=Number(endDate)*1000;
    console.log('startDate vs endDate',startDate+'vs'+endDate);
    let stakeDays=await cObj.methods.getStakeDays().call();
    console.log('stakeDays',stakeDays);
    let days=Math.floor(Number(stakeDays)/(3600*24));
    console.log('days',days);
    let dayDisplay=days>0?days+(days==1?"day,":"days,"):"";
    document.querySelectorAll(".Lock-period-value").forEach(function(element){
        element.innerHTML=`${dayDisplay}`;
    })
let rewardBal=await cObj.methods
.getUserEstimatedRewards()
.call({from:currentAddress});
document.getElementById("user-reward-balance-value").value=`Reward:${
    rewardBal/10**18
}${SELECT_CONTRACT[_NETWORK_ID].TOKEN.symbol}`;
let balMainUser=currentAddress?await oContractToken.methods.balanceOf(currentAddress).call():"";
balMainUser=Number(balMainUser)/10**18;
console.log('balMainUser',balMainUser);
document.getElementById("user-token-balance").innerHTML=`Balance: ${balMainUser}`;
let currentDate=new Date().getTime();
if(isStakingPaused){
    console.log('currentDate',isStakingPaused+'vs'+startDate);
    isStakingPausedText="Paused";
}else if(currentDate<startDate){
    console.log('isStakingPaused',isStakingPaused+'vs'+startDate);
    isStakingPausedText="Locked";
}else if(currentDate>endDate){
    console.log('currentDate vs endDate',currentDate/100000+'vs'+endDate/100000);
    isStakingPausedText="Ended";
}else{

    isStakingPausedText="Active";
}
document.querySelectorAll('.active-status-stacking').forEach(function(element){
    element.innerHTML=`${isStakingPausedText}`;
})
if(currentDate>startDate&&currentDate<endDate){
    const ele=document.getElementById("countdown-time-value");
    generateCountDown(ele,endDate);
    document.getElementById("countdown-title-value").innerHTML=`Staking ends in`;
}
if (currentDate<startDate){
    const ele=document.getElementById("coutdown-time-value");
    generateCountDown(ele,endDate);
    document.getElementById("countdown-title-value").innerHTML=`Staking Starts In`;
}
document.querySelectorAll('.apy-value').forEach(function(element){
    element.innerHTML=`${cApy}%`;
});
 }catch(error){
        console.log(error);
        notyf.error(
            `Unable to fetch data from ${SELECT_CONTRACT[_NETWORK_ID].network_name}!\n Please refresh this page.`
        );
    }

// Check if the web3 object is available
if (typeof web3 !== 'undefined') {
    // Web3 object is available
    console.log('Web3 is available');
    
    // Check if the web3 object has the eth property
    if (web3.eth) {
        // Web3 object has the eth property
        console.log('Web3.eth is available');
        
        // Now you can use web3.eth methods or properties
        // Example:
        async function getCurrentNetworkId() {
    console.log('Current network ID:', await web3.eth.net.getId());
}

// Then call the function
getCurrentNetworkId();    } else {
        console.log('Web3.eth is not available');
    }
} else {
    console.log('Web3 is not available');
}

}

function generateCountDown(ele, claimDate) {
    if (!ele) {
        console.error("Element is null or undefined.");
        return;
    }
    clearInterval(countDownGlobal);
    var countDownDate = new Date(claimDate).getTime();
    countDownGlobal = setInterval(function() {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        ele.innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
        if (distance < 0) {
            clearInterval(countDownGlobal);
            ele.innerHTML = "Countdown ended";
        }
    }, 1000);
}


    
    async function connectMe(_provider){
        try{
            let _comn_res=await commonProviderDetector(_provider);
           console.log(_comn_res);
            if(!_comn_res){
                console.log("Please Connect");
            }else{
                let sClass=getSelectedTab()
                console.log(sClass);
            }
        }catch(error){
            notyf.error(error.message);
        }
    }
async function stackTokens(){
    try{
        let nTokens=document.getElementById("amount-to-stack-value-new").value;
        if (!nTokens){
            return;
        }
        if(isNaN(nTokens)||nTokens==0||Number(nTokens)<0){
            console.log(`Invalid token amount`);
            return;
        }
        nTokens=Number(nTokens);
        let tokenToTransfer=addDecimal(nTokens,18);
        console.log("tokenToTransfer",tokenToTransfer);
        let balMainUser=await oContractToken.methods
        .balanceOf(currentAddress).call();
        balMainUser=Number(balMainUser)/10**18;
        console.log("balMainUser",balMainUser);
        if(balMainUser<nTokens){
            notyf.Error(
                `insufficient tokens on ${SELECT_CONTRACT[_NETWORK_ID].network_name}.\nPlease boy some tokens first!`
            );
            return;
        }
        let sClass=getSelectedTab(contractCall);
        console.log(sClass);
        let balMainAllowance=await oContractToken.methods.allowance(
            currentAddress,SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address
        ).call();
    if(Number(balMainAllowance)<Number(tokenToTransfer)){
        approveTokenSpend(tokenToTransfer,sClass);
    }else{
        stackTokenMain(tokenToTransfer,sClass);
    }
    }catch(error){
        const notification = notyf.open({
            type: 'success',
            message: 'Notification message here'
        });
        console.log(error);
        notyf.dismiss(notification);
        notyf.error(formatEthErrorMsg(error));
    }
}
async function approveTokenSpend(_min_fee_wei,sClass){
    let gasEstimation;
    try{
        gasEstimation=await oContractToken.methods.approve(
            SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address,
            _min_fee_wei
        ).estimateGas({
            from:currentAddress,
        })
    }catch(error){
        console.log(error);
        notyf.error(formatEthErrorMsg(error))
        return;
    }
    //hna  8:33!59
    oContractToken.methods.approve(
        SELECT_CONTRACT[_NETWORK_ID].STACKING[sClass].address,
        _min_fee_wei
        )
    .send({
        from:currentAddress,
        gas:gasEstimation,
    })
    .on("transactionHash",(hash)=>{
        console.log("Transaction Hash",hash);
    })
    .on("receipe",(receipt)=>{
        console.log(receipt);
        stackTokenMain(_min_fee_wei);
    })
    .catch((error)=>{
        console.log(error);
        notyf.error(formationEthErrorMsg(error));
        return;
    })
}
async function stackTokenMain(_amount_wei,sClass){
    let gasEstimation;
    let oContractStacking=getContractObj(sClass);
    try{
        gasEstimation=await oContractStacking.methods
        .stake(_amount_wei)
        .estimateGas({from:currentAddress,});
    }catch(error){
        console.log(error)
        notyf.error(formatEthErrorMsg(error));
        return;
}
oContractStacking.methods
.stake(_amount_wei)
.send({from:currentAddress,
    gas:gasEstimation,
})
.on("receipt",(receipt)=>{
    console.log(receipt);
    const receiptObj={
        token:_amount_wei,
        from:receipt.from,
        to:receipt.to,
        blockHash:receipt.blockHash,
        blockNumber:receipt.blockNumber,
        cumulativeGasUSed:receipt.cumulativeGasUsed,
        effectiveGasPrice:receipt.effectiveGasPrice,
        gasUsed:receipt.gasUsed,
        status:receipt.Status,
        transactionHash:receipt.transactionHash,
        type:receipt.type,
    };
    let transactionHistory=[];
    const allUserTransaction=localStorage.getItem("transactions");
    console.log('transactionHistory',transactionHistory);
    if (allUserTransaction){
        transactionHistory=JSON.parse(localStorage.getItem("transactions"));
        transactionHistory.push(receiptObj);
        localStorage.setItem(
            "transactions",
            JSON.stringify(transactionHistory)
            
        );
        console.log('transactionHistory',transactionHistory);

    }else{
        transactionHistory.push(receiptObj);
        localStorage.setItem(
            "transactions",JSON.stringify(transactionHistory)
        );
        console.log('allUserTransaction',allUserTransaction);

    }
    window.location.href="http://127.0.0.1:5500/token-stacking-dapp-starter-file/analytic.html";
})
.on("transactionHash",(hash)=>{
    console.log("Transaction Hash",hash);

})

.catch((error)=>{
    console.log(error);
    notyf.error(formatEthErrorMsg(error));
    return;
})
}

async function unstackTokens(){
    try{
        let nTokens=document.getElementById("amount-to-unstack-value").value;
        if(!nTokens){
            return;
        }
        if(isNaN(nTokens)||nTokens==0||Number(nTokens)<0){
        notyf.error("Invalid token amount");
    return;
    }
    nTokens=Number(nTokens);
    let tokenToTransfer=addDecimal(nTokens,18);
    let sClass=getSelectedTab(contractCall);
    oContractStacking=getContractObj(sClass);
    let balMainUser=await oContractStacking.methods
    .getUser(currentAddress).call();
    balMainUser=Number(balMainUser.stackeAmount/10**18);
    if(balMainUser<nTokens){
        notyf.error(
            `insufficient staked tokens pn ${SELECT_CONTRACT[_NETWORK_ID].network_name}!`);
        return;
    }
    unstackTokenMain(tokenToTransfer,oContractStacking,sClass);
    notification = notyf.open({
        type: 'info',
        message: 'Processing...',
    });
}catch(error){
    console.log(error);
    notyf.dismiss(notification);
    notyf.error(formatEthErrorMsg(error));
}
}
async function unstackTokenMain(_amount_wei,oContractStacking,sClass){
let gasEstimation;
try{
    gasEstimation=await oContractStacking.methods
    .unstake(_amount_wei).estimateGas({
        from:currentAddress,
    })
}catch(error){
    console.log(error);
    notyf.error(formatEthErrorMsg(error));
    return;
}
oContractStacking.methods.unstake(_amount_wei).send({
    from:currentAddress,
    gas:gasEstimation,
}).on("receipt",(receipt)=>{
    console.log(receipt);
    const receiptObj={
        token:_amount_wei,
        from:receipt.from,
        to:receipt.to,
        blockHash:receipt.blockHash,
        blockNumber:receipt.blockNumber,
        cumulativeGasUSed:receipt.cumulativeGasUSed,
        effectiveGasPrice:receipt.effectiveGasPrice,
        gasUsed:receipt.gasUsed,
        status:receipt.status,
        transactionHash:receipt.transactionHash,
        type:receipt.type,
    };
    let transactionHistory=[];
    const allUSerTransaction=localStorage.getItem("transaction");
    if(allUserTransaction){
        transactionHistory=JSON.parse(localStorage.getItem("transaction"));
        transactionHistory.push(receiptObj);
        localStorage.setItem(
            "transaction",JSON.stringify(transactionHistory));
    }else{
        transactionHistory.push(receiptObj);
        localStorage.setItem(
            "transaction",JSON.stringify(transactionHistory)
        )
    }
    window.location.href="http://127.0.0.1:5500/analytic.html";
})
.on("transactionHash",(hash)=>{
    console.log("Transacion Hash",hash);
})
.catch((error)=>{
    console.log(error);
    notyf.error(formatEthErrorMsg(error));
    return;
});
}
async function claimTokens(){
    try{
        let sClass=getSelectedTab(contractCall);
        let oContractStacking=getContractObj(sClass);
        let rewardBal=await oContractStacking.methods
        .getUserEstimatedRewards()
        .call({from:currentAddress});
        rewardBal=Number(rewardBal);
        console.log("rewardBal",rewardBal);
        if(!rewardBal){
            notyf.dismiss(notification);
            notyf.error(`insuffucuent reward tokens to claim!`);
            return;
        }
        claimTokenMain(oContractStacking,sClass);
    }catch(error){
        console.log(error);
        notyf.dismiss(notification);
        notyf.error(formatEthErrorMsg(error));
    }
    }
async function claimTokenMain(){
    try{
        let sClass=getSelectedTab(contractCall);
        let oContractStacking=getContractObj(sClass);
        let rewardBal=await oContractStacking.methods
        .getUserEstimatedRewards()
        .call({from:currentAddress});
        rewardBal=Number(rewardBal);
    console.log("rewardBal",rewardBal);
    if(!rewardBal){
        notyf.dismiss(notification);
        notyf.error(`insufficient reward tokens to claim`);
        return;
    }
    claimTokenMain(oContractStacking,sClass);
}catch(error){
    console.log(error);
    notyf.dismiss(notification);
    notyf.error(formatEhErrorMSg(error));
}
    }
    async function claimTokenMain(oContractStacking,sClass){
        let gasEstimation;
        try{
            gasEstimation=await oContractStacking.methods.claimReward().estimateGas({
                from:currentAddress,
            })
            console.log("gasEstimation",gasEstimation);
        
    }catch(error){
        console.log(error);
    notyf.error(formatEthErrorMsg(error));
        return;
}
oContractStacking.methods.claimReward().send({
    from:currentAddress,
    gas:gasEstimation,
})
.on("receipt",(receipt)=>{
    console.log(receipt);
    const receiptObj={
        from:receipt.from,
        to:receipt.to,
        blockHash:receipt.blockHash,
        blockNumber:receipt.blockNumber,
        cumulativeGasUSed:receipt.cumulativeGasUSed,
        effectiveGasPrice:receipt.effectiveGasPrice,
        gasUsed:receipt.gasUSed,
        status:receipt.status,
        transactionHash:receipt.transactionHash,
        type:receipt.type,
    };
    let transactionHistory=[];
    const allUserTransactionn=localStorage.getItem("transactions");
    if(allUSerTransaction){
        transactionHistory=JSON.parse(localStorage.getItem("transactions"));
        transactionHistory.push(receiptObj);
        localStorage.setItem(
            "transactions",SJON.stringify(transactionHistory));
    }else{
        transactionHistory.push(receiptObj);
        localStorage.setItem(
            "transaction",
            JSON.stringify(transactionHistory));     
    }
        window.location.href="http://127.0.0.1:5500/token-stacking-dapp-starter-file/analytic.html";
    })
    
    .on("transactionHash",(hash)=>{
        console.log("transaction Hash:",hash);
    })
    .catch((error)=>{
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        return;
    })
    
}
