//SPDX-License-Identifier:MIT
pragma solidity^0.8.0;
interface IERC20{
event Transfer( address indexed from,address to,uint256 value);
event Approval(address indexed owner,address indexed spender,uint value);
function balanceOf(address account)external view returns (uint);
function transfer(address to,uint amount)external returns(bool);
function allownance (address owner,address spender)external view returns(uint);
function approve(address spender,uint amount)external returns (bool);
function transferFrom(address from,address to,uint amount)external returns (bool);
}