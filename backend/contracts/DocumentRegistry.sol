// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DocumentRegistry {
    mapping(bytes32 => bool) private documents;
    mapping(bytes32 => string) private ipfsHashes;
    
    event DocumentRegistered(bytes32 indexed documentHash, string ipfsHash);
    event DocumentUnregistered(bytes32 indexed documentHash);
    
    function registerDocument(bytes32 documentHash, string memory ipfsHash) public {
        require(!documents[documentHash], "Document already registered");
        documents[documentHash] = true;
        ipfsHashes[documentHash] = ipfsHash;
        emit DocumentRegistered(documentHash, ipfsHash);
    }
    
    function verifyDocument(bytes32 documentHash) public view returns (bool) {
        return documents[documentHash];
    }
    
    function unregisterDocument(bytes32 documentHash) public {
        require(documents[documentHash], "Document not registered");
        
        // Delete the document from both mappings
        delete documents[documentHash];
        delete ipfsHashes[documentHash];
        
        // Emit an event to log the unregistration
        emit DocumentUnregistered(documentHash);
    }
}