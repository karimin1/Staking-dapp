const userTransaction=JSON.parse(localStorage.getItem("transactions"));
const User=JSON.parse(localStorage.getItem("User"));
console.log('analytic userttransaction',userTransaction);
console.log('user',User);
function generateCountDoun(){
    var now=new Date().getDate()
    var minutes=Math.floor((now%(1000*60*60))/(1000*60));
    var seconds=Math.floor((now%(1000*60))/1000);
    return minutes+'m'+seconds+"s";
}
  async function  getUser(){
    try{
      const UserProfile=document.querySelector('.contract-user');
  const userProfileHtml=`
  <div class="contract-user-profile">
  <div class="contract-user-profile-info">'
  <img src="assets/img/content/team_1.png" alt=""/>
  <span class="contract-space"><strong>Address:</strong>${User.address.slice(0,25)}</span>
  <span class="contract-space"><strong>stakeAmount:</strong>${User.stakeAmount/10**18}</span>
  <span class="contract-space"><strong>LastRewardCalculationTime:</strong>${generateCountDoun(User.lastRewardCalculationTime)}</span>
  <span class="contract-space"><strong>lastStakeTime:</strong>${generateCountDoun(User.LastStakeTime)}</span>
  <span class="contract-space"><strong>rewardsClaimedSoFar:</strong>${User.rewardsClaimedSoFar/10**18}</span>
  <span class="contract-space"><strong>Reward Token:</strong>${User.rewardAmount/10**18}</span>
  <p class="contract-paragraph"> ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsumLorem ipsum</p>
  </div>
  </div>` ;
  UserProfile.innerHTML=userProfileHtml;
    }catch(error){
      console.log(error);}
  }
  getUser();
  async function getTransaction(){
    try{
      const contractTransactionList=document.querySelector('.dataUserTransaction');
      const userTransactionHistory=userTransaction.map((transaction,i)=>{
      return `
      <div class="col-12 col-md-6 col-lg-4 item explore-item"  data-groups='["ongoing,"ended"]'>
     <div class="card project-card">
     <div class="media">
      <a href="project-details.html"><img src="assets/img/content/thumb_${i+1}.png" alt="" class="card-img-top avatar-max-lg"/></a>
      <div class="media-body ml-4">
        <a href="project-details.html">
          <h4 class="m-0">#tbCoders</h4>
        </a>
        <div class="countdown-times">
        <div class="my-2">Transaction No:${i+1}</div>
        <div class="countdown d-flex" data-data="2022-06-30"></div>
      </div>
      </div> 
    </div> 
  
    <div class="card-body">
      <div class="items">
        <div class="single-item">
          <span>${transaction.token/10**18?"Amount":"Claim Token"}</span>
          <span>${transaction.token/10**18||""}</span>
        </div>
        <div class="single-item">
          <span>Gas</span>
          <span>${transaction.gasUsed}</span>
        </div>
        <div class="single-item">
          <span>Status</span>
          <span>${transaction.status}</span>
        </div>
      </div>
    </div>
    <div class="project-footer d-flex align-items-center mt-4 mt-md-5">
      <a target='blank' class="btn btn-bordered-white btn-smaller" href="https://polygonscan.com/tx/${transaction.transactionHash}">Transaction</a>
      <div class="social-share ml-auto">
        <ul class="d-flex list-unstyled">
          <li>
            <a href="#">
              <i class="fab fa-twitter"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fab fa-telegram"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fab fa-discord"></i>
            </a>
          </li>
          <li>
            <a href="#">
              <i class="fab fa-youtube"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div class="blockchain-icon">
      <img src="assets/img/content/ethereum.png" alt="">
    </div>
  </div>
  </div>`;
  })
  contractTransactionList.innerHTML=userTransactionHistory;  
  }catch(error){console.log(error);}
  }
      
    getTransaction();
