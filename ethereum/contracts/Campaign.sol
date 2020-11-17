/** SPDX-License-Identifier: UNLICENSED */
pragma solidity ^0.7.4;

contract CampaignFactory {
    Campaign[] public deployedCampaigns;
    
    function createCampaign(uint minimum) public {
        Campaign newCampaign = new Campaign(minimum); // returns the address of the newly created Campaign
        deployedCampaigns.push(newCampaign);
    }
    
    function getDeployedCampaigns() public view returns (Campaign[] memory) {
        return deployedCampaigns;
    }
}


contract Campaign {
    
    struct ExpenseRequest {
        string description;
        uint value;
        address payable recipient;
        bool complete;
        uint approvalCount;
    }
    
    
    struct ApprovalMapping {
        mapping(uint => bool) mappings;
    }
    
    ExpenseRequest[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public backers;
    mapping(address => ApprovalMapping) approvals;
    uint public backersCount;
    
    constructor(uint minimum) {
        manager = tx.origin;
        minimumContribution = minimum;
    }
    
    modifier onlyManager {
        require(msg.sender == manager);
        _;
    }
    
    function contribute() public payable {
        require(msg.value > minimumContribution);
        if (!backers[msg.sender]) {
            backers[msg.sender] = true;
            backersCount++;
        }
    }
    
    
    function createRequest(string memory description, uint value, address payable recipient) public onlyManager {
        ExpenseRequest memory newRequest = ExpenseRequest({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalCount: 0
        });
        
        requests.push(newRequest);
    }
    
    
    function approveRequest(uint index) public {
        require(backers[msg.sender]);
        mapping(uint => bool) storage sendersApprovals = approvals[msg.sender].mappings;
        
        require(!sendersApprovals[index]);
        
        sendersApprovals[index] = true;
        requests[index].approvalCount++;
        
    }
    
    function finalizeRequest(uint index) public onlyManager {
        ExpenseRequest storage req = requests[index];
        
        require(req.approvalCount > (backersCount / 2));
        require(!req.complete);
        
        req.recipient.transfer(req.value);
        req.complete = true;
    }
    
    function getSummary() public view returns (uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            backersCount,
            manager
        );
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}