//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV2V3Interface.sol";

import "./SortitionSumTreeFactory.sol";
import "./UniformRandomNumber.sol";

contract Lottery is Ownable, ReentrancyGuard {
    using SortitionSumTreeFactory for SortitionSumTreeFactory.SortitionSumTrees;

    enum Choice { Eth, Usd }

    bytes32 constant private TREE_KEY_1 = keccak256("ForexLottery/Option1");
    bytes32 constant private TREE_KEY_2 = keccak256("ForexLottery/Option2");
    uint256 constant private MAX_TREE_LEAVES = 5;

    AggregatorV2V3Interface internal priceFeed;
    SortitionSumTreeFactory.SortitionSumTrees private sortitionSumTrees;

    uint256 immutable public creationRound;
    int256 immutable public price;

    address public winner;
    uint256 public biggestBetEth;
    uint256 public biggestBetUsd;

    mapping(address => uint) public bets;

    constructor(address aggregator)  {
        sortitionSumTrees.createTree(TREE_KEY_1, MAX_TREE_LEAVES);
        sortitionSumTrees.createTree(TREE_KEY_2, MAX_TREE_LEAVES);

        priceFeed = AggregatorV2V3Interface(aggregator);
        creationRound = priceFeed.latestRound();
        price = priceFeed.latestAnswer();

    }

    modifier participationOpenned() {
        require(priceFeed.latestRound() == creationRound, "participation closed");
        _;
    }

    modifier participationClosed() {
        require(priceFeed.latestRound() > creationRound, "participation openned");
        _;
    }

    function participate(Choice choice) 
        external 
        participationOpenned 
        nonReentrant 
        payable 
    {
        require(bets[msg.sender] == 0, "already participant");
        require(msg.value >= 1 wei, "minimum 1 wei to participate");

        if (choice == Choice.Eth && msg.value > biggestBetEth) {
            biggestBetEth = msg.value;
        }
        if (choice == Choice.Usd && msg.value > biggestBetUsd) {
            biggestBetUsd = msg.value;
        }

        bets[msg.sender] = msg.value;

        if (choice == Choice.Eth) {
            sortitionSumTrees.set(TREE_KEY_1, msg.value, bytes32(uint256(uint160(msg.sender))));
        } else {
           sortitionSumTrees.set(TREE_KEY_2, msg.value, bytes32(uint256(uint160(msg.sender))));
        }
    }

    function withdraw() external nonReentrant participationClosed {
        require(bets[msg.sender] > 0, "no participation");
        
        (bool sent, ) = msg.sender.call{value: bets[msg.sender]}("");
        require (sent, "require sent");

        bets[msg.sender] = 0;
    }

    function selectWinner() external onlyOwner participationClosed returns(bool) {        
        int256 newPrice = priceFeed.getAnswer(3);


        uint256 biggestBet;
        bytes32 tree;


        if (newPrice > price) {            
            biggestBet = biggestBetEth;
            tree = TREE_KEY_1;
        }

        if (newPrice < price) {
            biggestBet = biggestBetUsd;
            tree = TREE_KEY_2;
        }

        if (biggestBet == 0) return false;

        uint256 entropy = uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, biggestBetEth + biggestBetUsd)));
        uint256 token = UniformRandomNumber.uniform(entropy, biggestBet);

        winner = address(uint160(uint256(sortitionSumTrees.draw(tree, token))));
        return true;
    }
}
