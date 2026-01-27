# Capstone
This is the repository for the Capstone project for California State University of Fullerton CPSC 490/491. This project aims to develop a time management app, Procuratio, that helps users with daily planning, health management, such as eating and drinking, and logistical issues, such as shopping/errands. The system will provide notifications and reminders for tasks like assignments, appointments, exercise, goals, meals, hydration, and sleep. The goal is to help users gain a balance in life with productivity and wellness by creating a schedule for the user for optimal living conditions. This project would start as a full-stack web application for accessibility, utilizing APIs like Google Maps for traffic information and an AI model of choice to manage efficient time management. The tracking of the statistics of the User’s lifestyle would help the User with visualizing the data of their health. Later on, if there is time in the development cycle, then the development would move to mobile applications, but the scope of the project is currently on the full-stack application for display.

# Introduction & Statement of Need
Many people struggle with balancing academics, work, and personal responsibilities. Missed deadlines, time management, and unhealthy living are results of ineffective planning. The project aims to help people with an assistant that can do the planning optimally that track tasks, life responsibilities, and work on behalf of the user to make their lives easier. The assistant would ask the user for their daily activities, Height, Weight, and needs, like if they have to go to the bank, and the assistant would make an optimal schedule considering traffic, time availability, and bodily functions. AI assistants like Google Assistant, Siri, and Alexa are useful to people but are simple in their function, as they do not effectively plan for the user, but set a reminder for them.

# Proposed Solution
There are a few things to consider before we can begin development. Concerning the structure of the application, we must first determine whether scheduling will occur on the end-user device or within a dedicated server. Both have their benefits and downsides, but it is very well possible to implement either. We could inquire with the end user whether they would prefer to keep all application processes running on their end device or whether they would rather have that end device reach out to a server to maintain and update their schedules. Having the application run entirely on the end user system allows it to be accessible at any time, any place, with no need for a network connection to our server(s). However, this would be space inefficient, as every user device would have to download the entire application and maintain related processes. Running the application’s processes from a server would save space on the end user device while centralizing application operations (making it easy to maintain or update). However, this may lead to lessened performance (depending on network traffic) and the potential for Man-In-The-Middle attacks should network traffic be intercepted. Alternatively, we can create an application with both capabilities; more specifically, where the schedule generation would happen on the server’s side and the schedule’s maintenance would remain on the end user’s side. This would serve to achieve the most desirable traits of both options.

In addition to these considerations, it is crucial to evaluate how scalability and security will influence our decision, as they are integral to the overall effectiveness of the chosen approach. A server-based approach naturally lends itself to easier scalability, as additional computing resources can be allocated as the user base grows, which is a critical factor in our decision-making process. In contrast, local device processing may struggle to handle heavier workloads without significant optimization. Conversely, a device-based approach offers greater resilience against widespread outages, ensuring each user’s application remains functional even if the central server fails, which is an important consideration in our decision-making. From a security standpoint, implementing robust encryption and authentication measures is crucial in either model to safeguard sensitive scheduling data, directly impacting our choice of approach. Ultimately, our design choice should be guided by balancing user convenience, data security, performance efficiency, and long-term maintainability, while carefully considering the scalability and resilience benefits of each approach.

# Current Progress

This project is currently under active development as part of the CPSC 490/491 Capstone sequence. At this stage, the system architecture, design methodology, and core website structure have been established. Feature implementation, AI integration, and scheduling logic are planned for upcoming development phases.

# Tech Stack
- **Frontend:** React, HTML, CSS, JavaScript
- **Backend:** Node.js (planned)
- **Database:** TBD (SQL/NoSQL under evaluation)
- **APIs:** Google Maps API (planned), Google Gemini (planned)
- **Version Control:** Git & GitHub
  
# Research

Normurodov, E., & Ayoobkhan, M. U. A. (2021). Dynamic Time Tracking and Task Monitoring Agent Service. In 2021 International Conference on Technological Advancements and Innovations (ICTAI) (pp. 622–626). IEEE. https://doi.org/10.1109/ictai53825.2021.9673299  

Singh, N. T., None Preeti, Kumar, R., Anish Choubey, Suresh, N., & Singh, J. (2024). An All-Inclusive Daily Task Tracker App for Enhancing College Student Productivity. In 2024 15th International Conference on Computing Communication and Networking Technologies (ICCCNT) (pp. 1–5). IEEE.  https://doi.org/10.1109/icccnt61001.2024.10724109 

Sureshkumar, S., Suryavarshini, S., Chellammal, P., Murugan, K. R. S., Rani, P. K., & Kaviyaraj, R. (2023). Hourly Journal: A Mobile App for Optimizing Your Daily Routines. In 2023 7th International Conference on Intelligent Computing and Control Systems (ICICCS) (pp. 1073-1078). IEEE. https://doi.org/10.1109/ICICCS56967.2023.10142712   

Yeo, J. L., JosephNg, P. S., Alezabi, K. A., Eaw, H. C., & Phan, K. Y. (2020). Time scheduling and finance management: University student survival kit. In 2020 IEEE Student Conference on Research and Development (SCOReD) (pp. 1–6). IEEE. https://doi.org/10.1109/SCOReD50371.2020.9250969  

Zhao, W., et al. (2023). Design and implementation of a time management self-help mobile app for college students. In 2023 IEEE Integrated STEM Education Conference (ISEC) (pp. 81–88). IEEE. 
https://doi.org/10.1109/ISEC57711.2023.10402177 


# Planned API(s)
* Google Maps
* Google Gemini

# Backups API(s)
* Radar(Google Maps alternative)
* ChatGPT (AI alternative)

# Team Schedule
<img width="679" height="557" alt="image" src="https://github.com/user-attachments/assets/050dce01-01b5-4efc-8e29-cfcf32e9161a" />
<img width="468" height="184" alt="image" src="https://github.com/user-attachments/assets/4647d531-d257-48c0-8a32-d63b0dbaf19b" />
</br>
<img width="468" height="206" alt="image" src="https://github.com/user-attachments/assets/24599933-40a3-4f0e-ab43-47fd57c041e6" />


# Webpage

Homepage
<img width="2528" height="1231" alt="image" src="https://github.com/user-attachments/assets/2791f475-3242-4f44-b6d3-63181e7c8f04" />
<img width="2522" height="1230" alt="image" src="https://github.com/user-attachments/assets/fe1bb91e-0687-4fc0-a036-bb232bdaa519" />
<img width="2525" height="1230" alt="image" src="https://github.com/user-attachments/assets/7f9f4d21-3e03-4a54-8aaa-61e223ba1347" />
<img width="2530" height="1227" alt="image" src="https://github.com/user-attachments/assets/687bd578-d9d6-407a-a11b-1fb7748a0e71" />

Login Page
<img width="2555" height="1261" alt="image" src="https://github.com/user-attachments/assets/3c3e9ab7-c34e-48dc-b971-71db9d8c4bce" />




# Team Members
* Dylan Phan
* Vincent Nguyen
* Helen Ngo
* Matthew Lim


