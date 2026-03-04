# Step-by-Step AWS Infrastructure Guide for Bedrock Chatbot

This guide will walk you through setting up the serverless backend required to power your React chatbot using Amazon Bedrock and **Amazon Nova Micro** (the absolute cheapest and fastest model available).

---

## 1. Requesting Model Access in Amazon Bedrock
*Update: AWS recently retired the manual "Model access" page! Serverless Foundation models are now automatically enabled when first invoked.*

1.  Log in to the **AWS Management Console**.
2.  Make sure you are in a region that supports Bedrock (e.g., `us-east-1` N. Virginia or `us-west-2` Oregon). Note your region; you will build everything else here.
3.  In the search bar, type **Bedrock** and open the Amazon Bedrock console.
4.  In the left navigation pane, under **Foundation models**, click **Model catalog**.
5.  Search for or locate **Amazon Nova Micro** and click on it.
6.  Because it's a first-party Amazon model, you generally do NOT need to fill out a use-case form like you do for Anthropic models.
7.  The model will be fully enabled the first time your Lambda function invokes it.

---

## 2. Creating the IAM Role (Permissions)
Your Lambda function needs permission to talk to Bedrock and write logs.

1.  In the AWS Console search bar, type **IAM** and open the IAM console.
2.  In the left navigation, click **Roles**, then click **Create role**.
3.  **Trusted entity type**: Select **AWS service**.
4.  **Service or use case**: Choose **Lambda** from the dropdown. Click **Next**.
5.  **Add permissions**:
    *   Search for `AWSLambdaBasicExecutionRole` and check the box next to it.
6.  Click **Next**, give the role a name (e.g., `PortfolioChatbotLambdaRole`), and click **Create role**.
7.  Now, find that role you just created in the list and click deeply on its name.
8.  In the *Permissions* tab, click the **Add permissions** dropdown -> **Create inline policy**.
9.  Click the **JSON** tab and paste the following:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BedrockInvoke",
            "Effect": "Allow",
            "Action": [
                "bedrock:InvokeModel"
            ],
            "Resource": "*"
        }
    ]
}
```
10. Click **Next**, name the policy (e.g., `BedrockInvokePolicy`), and click **Create policy**.

---

## 3. Creating the AWS Lambda Function
This is the "brain" that receives messages from your website and passes them to Bedrock.

1.  In the AWS search bar, type **Lambda** and navigate there.
2.  Click **Create function**.
3.  Choose **Author from scratch**.
    *   **Function name**: `PortfolioChatbotLogic`
    *   **Runtime**: `Node.js 20.x` (or 18.x)
4.  Expand **Change default execution role**:
    *   Choose **Use an existing role**.
    *   Select the role you created in Step 2 (`PortfolioChatbotLambdaRole`).
5.  Click **Create function**.
6.  Scroll down to the **Code source** section. Replace the contents of `index.mjs` with the following code:

```javascript
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

// Hardcode your region here!
const client = new BedrockRuntimeClient({ region: "us-east-1" });

export const handler = async (event) => {
    // API Gateway passes the request body as a stringified JSON
    let body;
    try {
        body = JSON.parse(event.body);
    } catch(err) {
        return { statusCode: 400, body: JSON.stringify({ message: "Invalid JSON format" }) };
    }
  
    const userMessage = body.message;
    if (!userMessage) {
        return { statusCode: 400, body: JSON.stringify({ message: "Missing 'message' field" }) };
    }

    // THIS IS YOUR SYSTEM PROMPT: Put your resume data and instructions here!
    const SYSTEM_PROMPT = `You are a professional, helpful AI assistant built to answer recruiter questions about Tony Le's portfolio. 
Answer questions based ONLY on this information:

# Contact & Profile
- Name: Tony T Le
- Role: AWS Cloud Engineer
- Email: tonyle9493@gmail.com
- Phone: 713-480-6658
- LinkedIn: linkedin.com/in/ttle54
- Summary: Collaborative AWS Cloud Engineer with 7+ years of experience and an AWS Certified AI Practitioner credential, specializing in secure GovCloud environments. While at CGI, partnered with California Health and Human Services (CHHS) to co-architect a GenAI engine that automated 10M+ records with 99.8% accuracy, reducing audit cycles by 75%. Expert at leading cross-functional teams to deploy scalable Bedrock and SageMaker solutions while maintaining strict NIST/FedRAMP compliance.

# Skills
- Cloud Platforms: AWS (EC2, Lambda, S3, RDS, Aurora, VPC, Route 53, CloudFront, GovCloud)
- AI/ML: AWS Bedrock, SageMaker, MLOps, LLM Deployment, Model Monitoring
- Infrastructure as Code: Terraform, CloudFormation, Ansible, Docker
- DevOps & Automation: Jenkins, GitLab CI/CD, AWS CodePipeline, Helm, EKS
- Security & Compliance: IAM, KMS, CyberArk, AWS Shield, WAF, Certificate Manager, CIS/NIST
- Monitoring & Budget: CloudWatch, Splunk, AWS Systems Manager, Cost Explorer, CloudHealth
- Networking: Security Groups, NACLs, ALB/NLB, Transit Gateway, Direct Connect
- Scripting & Tools: Python, Bash, YAML, JSON
- Operating Systems: RHEL, Windows Server

# Professional Experience
## Cloud Engineer @ CGI Inc, San Francisco, CA (Oct 2024 – Present)
- Architected secure GenAI workflows for California HHS using AWS Bedrock and Lambda within GovCloud, reducing manual data processing for state-level eligibility checks by 60%.
- Developed a custom Kiro-assisted development framework to automate Terraform provisioning, which cut AI environment setup time by 50% and eliminated drift in GovCloud environments.
- Hardened cloud security for CHHS AI workloads using IAM and AWS Shield, achieving a 35% risk reduction while maintaining strict NIST/CIS compliance for sensitive public sector datasets.
- Deployed CloudWatch, Splunk, and AWS Systems Manager to automate model observability, cutting mean-time-to-resolution (MTTR) for inference errors by 40%.
- Optimized AWS resource utilization via Cost Explorer, reducing AI-related cloud spend by 25% through the implementation of automated GPU-instance scheduling and lifecycle policies.
- Co-engineered LLM-based chatbot for public health inquiries, reducing manual support tickets by 45% while ensuring PII protection via AWS KMS.

## Cloud Engineer @ Kingstone Insurance Company, Kingston, NY (Mar 2024 – Oct 2024)
- Engineered high-performance MLOps pipelines on AWS EKS using Kubernetes and Helm, which enabled fully automated blue/green deployments for predictive risk models.
- Reduced release time for production workloads by 50% by integrating proactive autoscaling and zero downtime rollouts into the CI/CD pipeline.
- Implemented automated compliance controls with KMS and CyberArk to meet NYDFS and SOC 2 standards, reducing security exposure by 40% through continuous scanning.
- Orchestrated an enterprise-wide Disaster Recovery strategy leveraging AWS DRS, ensuring a <5 min RTO for mission-critical applications during quarterly failover drills.
- Led Tier 3 cloud operations for 200+ production workloads, performing root cause analysis via Jira and automating incident alerts with Splunk + CloudWatch, cutting MTTR by 30%.
- Standardized AWS infrastructure deployment using reusable Terraform modules and Ansible playbooks, reducing provisioning time by 60% and ensuring 99.99% uptime.

## Cloud Engineer @ Patterson-UTI Management Services, Houston, TX (May 2021-Nov 2023)
- Incident Management & Tier 3 Support: Provided Tier 3 support for AWS infrastructure, responding to escalated incidents and collaborating with customers to resolve tickets via JIRA.
- Delivered Tier 3 support for 150+ AWS-hosted enterprise systems, automating incident triage with CloudWatch, SNS, and Lambda.
- Cut average ticket resolution time by 30% and improved reliability through proactive monitoring dashboards in Splunk.
- Architected multi-region AWS infrastructure using Terraform and CloudFormation, enabling high availability (HA) and fault tolerance for enterprise-scale applications across 3 AWS regions.
- Led the migration of legacy database clusters to Amazon Aurora, improving query performance by 55% for mission-critical health data.
- Partnered with audit teams to maintain 100% compliance with internal security audits for all enterprise-scale applications.

# Education & Certifications
- Master of Business Administration, Western Governors University, Utah (Expected Aug 2025)
- Bachelor of Science, Computer Science, University of Houston, Houston, TX (Jun 2018)
- AWS Certified AI Practitioner (Expected Mar 2026)
- HashiCorp Terraform Associate (Expected Mar 2025)
- AWS Certified Developer Associate (Feb 2025)
- AWS Certified SysOps Associate (Mar 2024)
- AWS Certified Solution Architect Associate (Feb 2021)
- AWS Certified Cloud Practitioner (Mar 2021)

# Instructions
- If asked how to reach Tony, provide the email (tonyle9493@gmail.com) and LinkedIn link.
- If you don't know the answer to a question because it's not in this prompt, politely tell the user they can email Tony directly.
- Do not act like Tony himself (e.g., don't say "I am Tony Le" or use first-person pronouns like "I"). 
- Do not rigidly repeat phrases. 
- Be conversational, helpful, and professional concisely highlighting his experience.`;

    // Format the prompt for Amazon Nova models (Converse API format)
    const payload = {
        messages: [
            {
                role: "user",
                content: [{ text: userMessage }]
            }
        ],
        system: [{ text: SYSTEM_PROMPT }],
        inferenceConfig: {
            maxTokens: 500
        }
    };

    try {
        const command = new InvokeModelCommand({
            modelId: "amazon.nova-micro-v1:0",
            contentType: "application/json",
            accept: "application/json",
            body: JSON.stringify(payload)
        });

        const response = await client.send(command);
        
        // AWS SDK v3 returns a Uint8Array buffers, so we must decode it
        const decodedResponseBody = new TextDecoder().decode(response.body);
        const responseBody = JSON.parse(decodedResponseBody);
        
        // Extracting response from Nova format
        const botReply = responseBody.output.message.content[0].text;

        // Ensure we format the response back to your React app exactly as it expects
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ reply: botReply })
        };
        
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ reply: "Sorry, my backend hit a snag talking to Bedrock." })
        };
    }
};
```
7.  Click the grey **Deploy** button above the code editor to save the changes.
8.  *Important Note*: On the function's main page, go to the **Configuration** tab, then **General configuration**, click **Edit**. Change the **Timeout** from 3 seconds to **15 seconds** (sometimes LLM calls take longer than 3 seconds). Save.

---

## 4. Setting up API Gateway (The trigger)
This exposes your Lambda function securely to the internet so your front-end can reach it.

1.  In the AWS search bar, type **API Gateway**.
2.  Scroll down to **HTTP API** and click **Build** (HTTP APIs are cheaper and simpler than REST APIs).
3.  **Integrations**: Click **Add integration**, select **Lambda** from the dropdown, and choose your `PortfolioChatbotLogic` function.
4.  **API name**: `PortfolioChatbotAPI`
5.  Click **Next**.
6.  **Configure routes**:
    *   **Method**: `POST`
    *   **Resource path**: `/chat`
    *   **Integration target**: (Should already be set to your Lambda)
7.  Click **Next** (leave Stage as `$default` -> click Next), then click **Create**.
8.  **Setup CORS (Critical Step!)**:
    *   In the left-hand menu of your new API, click **CORS**.
    *   Click the **Configure** button.
    *   **Access-Control-Allow-Origins**: Type `https://ttle54.github.io` and click Add (also add `http://localhost:5173` for your local testing!).
    *   **Access-Control-Allow-Methods**: Select `POST` and `OPTIONS`.
    *   **Access-Control-Allow-Headers**: Type `content-type` and click Add.
    *   Click **Save**.
9.  **Get your URL**:
    *   In the left menu, click **API: PortfolioChatbotAPI**.
    *   You will see an **Invoke URL** (e.g., `https://xyz123.execute-api.us-east-1.amazonaws.com`).
    *   Your full address for the `.env` file will be the Invoke URL + your route: `https://xyz123.execute-api.us-east-1.amazonaws.com/chat`.

---

## Final Step
Take the URL from Step 4.9, paste it into your local `.env` file as `VITE_AWS_CHAT_API`, and test the chatbot on your local site (`npm run dev`)!
