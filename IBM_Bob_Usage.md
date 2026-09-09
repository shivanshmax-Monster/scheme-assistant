# Integration of IBM Bob in SchemeBot

## Overview

In our project, **SchemeBot** (AI Government Scheme Assistant), we leveraged the capabilities of **IBM Bob** to power the core conversational intelligence and Natural Language Processing (NLP) of the application. IBM Bob served as the brain of our chatbot, transforming a traditional, rigid form-filling experience into a dynamic, human-like conversation.

## Key Features & Workflows Enabled by IBM Bob

### 1. Intent Recognition and Entity Extraction
When a citizen interacts with SchemeBot, they often provide complex, unstructured sentences (e.g., *"I am an 18-year-old female from MP belonging to the ST category, looking for scholarships"*). We utilized IBM Bob to parse these natural language inputs. IBM Bob successfully extracted critical entities such as:
- **Demographics:** Age (18), Gender (Female)
- **Location:** State (Madhya Pradesh)
- **Social Category:** ST
- **Intent:** Seeking scholarships

By mapping these extracted entities to the required parameters of the government database, IBM Bob eliminated the need for users to manually fill out redundant fields.

### 2. Conversational State Machine Orchestration
Not all users provide complete information in their first message. We used IBM Bob to manage the conversational state. When IBM Bob detects that essential parameters (like Marital Status or Urban/Rural residence) are missing from the user's profile, it dynamically prompts the user with targeted follow-up questions. This orchestrated flow ensures that we gather exactly what is needed to query the live `api.myscheme.gov.in` database without overwhelming the user.

### 3. Fallback and Context Management
IBM Bob was essential in handling edge cases and unexpected inputs. If a user asked a general question or provided an invalid response, IBM Bob gracefully guided the conversation back on track, ensuring the context of the scheme-discovery process was never lost. 

## Development Activities
- **Prompt Engineering & Parameter Tuning:** We configured IBM Bob to understand the specific vocabulary surrounding Indian government schemes, ministries, and demographic categories.
- **Backend Integration:** We integrated IBM Bob directly into our Express.js backend (`server/index.js`). The user's input is passed to IBM Bob, which returns the parsed entities and the next required conversational state, before our server makes the final live API call to the government database.

By integrating IBM Bob, we successfully reduced the friction of discovering government policies, making the process accessible, intuitive, and highly efficient for all citizens.
