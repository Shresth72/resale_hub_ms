# PROJECT DOCUMENTATION

**System Design**
-

- Functional requirements
- Non Functional requirements
- Data storage requirements

### Functional Requirements
  
- User Sign-up / Login functionality
- User verification with OTP / SMS
- User can become seller / buyer
- Seller can create / update / delete products
- Seller can advertise products
- Buyer can purchase using online payment
- Seller can receive payment
- Email / Message notification
- Online chat with Seller & Buyer

### Non Functional Requirements

- System should be highly available in cloud with multiple region because this is C2C portal
- System should maintain best practices to be able to scale horizontally at any level
- System should design the way that can be broken down to microservices
- Loosely coupled services and communications
- It should have mechanism for logging and monitoring to inspect services health and availability
- System should be designed with documentation for better scope of usability
- Should follow CQRS

### Data Storage Requirements

- Should be consistent or eventually consistent
- Should follow CAP theorem (Consistency, Availability, and Partition Tolerance)
- Distributed database system and high availability
- High availability of Object Storge for multiple regions

<br/><br/>

**Project Architecture**
-

### Backend and Frontend Design

- This will follow a serverless approach
- The services will be divided into multiple microservices

<img src="./public/images/project_arch.png" alt="project_architecture"  style="width:600px;" />

### Database Design

<img src="./public/images/db_design.png" alt="database design"  style="width:800px;" />
