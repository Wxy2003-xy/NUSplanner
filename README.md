# NUSplanner

if you see this from the weblink, the site is currently under maintainace. Sorry for the inconvenience

## Proposed Level of Achievement:

Artemis

## Motivation

As we embark on the transition from high school to college, we are greeted by a multitude of courses, each presenting its own allure and potential pathways. As college freshmen, we often grapple with uncertainty, unsure of how to strategically chart our academic journey for the forthcoming four years. Despite acclimating to college life, the task of curating schedules that align with our aspirations remains a daunting challenge. Hence, We hope to provide insightful tips and guidance to current NUS students and incoming freshmen about course planning and course registration each semester. Course planning is a serious matter, and it is a regret many have not realised that before facing issues in their course of study, such as being choked by missing prerequisite courses and having their study plan disrupted. We have friends who faced unnecessary challenges due to poor course planning. In the second semester from her freshman year, she missed taking a foundational major course, which prevented her from taking several advanced major courses she had intended to take in her second year. Consequently, she found herself in a predicament, requiring urgent adjustments to her academic timetable. While our friend bears personal responsibility for this oversight, it underscores the potential benefits of implementing a recommendation system for freshmen. Such a system could mitigate similar issues by providing tailored guidance in course selection and scheduling.

Our project aims to help students navigate through the complicated process of course planning by providing customised recommendations based on available information and the users own preferences and aspirations. Our project will cater to users with different needs with various recommendation algorithms and schemes, depending on the goals of the users.

Besides course planning, timetable planning is a hefty task that requires students to carefully plan. With usually 20 or beyond MC each semester and multiple class sessions per course, timetable planning and bid for tutorials/recitations would require meticulous evaluation and many rounds of decision making to carry out optimally, especially given the fact that students are to make their choices from scratch. Our project aims to use the power of computing to consolidate necessary information and calculate optimal plans by ranking class slots based on a wide range of filters and rankers, to generate customised recommendation timetables for students to have a pivot to start working from and as a reference for course registration.

## Aim

We endeavour to introduce a groundbreaking recommendation system designed to guide current and prospective NUS students in crafting their ideal course schedule tailored to their unique preferences and academic requirements. This innovative system will not only propose comprehensive course schedules but also offer insights into the optimal timing for each course within every semester.

The next core feature of our project would assist students in organising their timetable and provide recommendation based on highly customisable sets of criteria for users to refer from in selecting class time slots.

Beyond that, our project would also include relevant QoL features that make the life of new students who are not yet familiar with life on campus easier, such as class reminders, map for class locations and more.

## User Stories

1.As a university freshman who wants to navigate course selection smoothly based on my own preference, I want to know more information and have some guidance over my course planning, especially at the start of the university life, such that there will not be disrupting scheduling issues occurring afterwards.

2.As a university student who wants to have a satisfactory timetable that suits my needs every semester, I want to be able to get a recommended timetable that suits my needs at the start of every semester. Nevertheless, I would like to retain the ultimate decision-making authority regarding the use of this recommended timetable, i.e, I can choose not to use the recommended timetable or make further adjustments from it.


## Features and Timeline
Our final product is an online website that allows students to receive recommended course planning schedules over the semesters, as well as to receive recommended timings of courses during each semester, based on their own preference. We might also develop
1.	Feature 1 (core): Recommend course schedule over semesters (4 years) Description: Users will first enter their respective majors and their completed courses. Then they will indicate their personal preferences regarding course planning, i,e. Focus on completing all the compulsory courses first, prefer finishing the prerequisites for certain advanced courses first etc. Then, there will be a personalised recommended schedule provided to them.
2.	Feature 2 (core): Recommend timetable over a specific semester Description: Besides recommending courses over semesters, the website can further recommend users timetables for any specific semester, based on their preference. For instance, after recommending student X to take courses A,B,C,D,E in semester Y, the website can further recommend a timetable of these 5 courses in semester Y, based on student X’s preference. Examples of preferences could be no courses in early morning, prefer no lessons on Friday, prefer consecutive courses to be located at venues close to each other etc.
3.	Auxiliary Features: ‘Community’, ‘Feedback’ and ‘About’. Description: ‘Community’ section serves as a platform for users to voice out their thoughts about NUSPlanner and related issues. Users can also make use of the ‘Feedback’ and ‘About’ section to give suggestions/feedback and know more about NUSPlanner.
4.	Further potential extension Features: QoL features: ‘Reminder’ and ‘Map’. Description: After users have fixed their timetables under the help of the recommendation system, the website has these two features that further enhance users’ experience, convenience, and overall satisfaction.For feature ‘Reminders’, it will remind users about certain special circumstances that they should take note of (to avoid incidents happening on our acquaintance from happening again). After each recommendation of course schedules, there will be an automatic corresponding reminder message updated at the bottom of the website, stating possible consequences if the recommendation is not followed. For instance, if the recommended courses in Year X Sem 2 are A,B,C,D,E. Then, one of the potential reminders could be “If not taking course A this semester, you cannot take course Y in Year (X+1) Sem 1”. For feature ‘Map’, it will automatically generate and present a map to the user. This map will indicate the transportation routes between venues of different (recommended) courses, for the user to visualise their transportation routine should they take the recommended combination.
Timeline (Subject to change)
1.	Lift-off - Setup the website (preferably with the foreshadowing feature integrated)
a. Set up the frontend of the website (static site hosting platform) Description: Elements like graphics and photos etc are implemented to enhance visual appeal and convey information. b. Set up the backend services Description: Use serverless functions to handle user interactions and serve the content. For example, trigger a function when the user clicks "next" to fetch and return the next page of content. b. Integrate the foreshadowing feature Description: Complete the foreshadowing feature
Lift-off completed by: Mid May (as required)
2.	Milestone1- Integrate core feature 1 (with self-testing) into the website a. Integrate core feature 1 into the website Description: Setup the database to store the data, which includes but not limited to the information of courses and majors. (Preferably Complete the recommendation algorithms to generate recommendations for users.) Implement the backend services to handle data processing, recommendation generation, communication with the database etc. Implement the frontend services to handle user interactions such as displaying recommended items to users. b. Self-Testing Description: Carry out self-testing to debug the feature (if there is any bug).
Milestone1 completed by: Early June (as required)
3.	Milestone 2 - Mostly done with core feature 1 and auxiliary features, with self-testing.  Integrate these features into the website. Starting and partially completed (functionality-wise) core feature 2. a. Self-Testing Description: Similar to Milestone1 b.
Milestone 2 completed by: Early July (as required)
4.	Milestone 3 - Complete core feature 2 with self-testing and integrate it into the website. Continue polishing core feature 1 and auxiliary features: 1. Self-testing to eliminate any potential service bugs. 2.Beautify UI. If there is sufficient time, integrate extension features (‘Reminder’ and ‘Map’) into the website.  Lastly, carry out user testing. a. Integrate extension feature into the website Description: Obtain necessary relevant course information and store it in the database Extract the data and present it to the user at the frontend. For instance, visualize the route for the user by presenting a transportation map. b. User Testing Description: After integrating all the (core, auxiliary, extension) features, carry out user testing by recruiting representative users from the target audience group. We plan to recruit a group of Year 1 freshmen to test out the course planning recommendation system (core feature 1), and recruit a group of Year 2 sophomore to test out the timetable planning recommendation system (core feature 2).

## Tech Stack

(Subject to change)
Front end Development
HTML/CSS: For structuring web pages and styling them
Javascript: To add interactivity and dynamic features to the website
Front-end Frameworks: Consider using frameworks/libraries like React.js, AngularJS, or Vue.js to streamline development and create a responsive, interactive user interface.

Back end Development
Java/Python: Consider using frameworks like Spring Boot(Java) or Django/Flask(Python)
SQL Database: To store data such as course information, user data and recommendations

Additional Technologies
APIs: Might need to integrate with external APIs for purposes like fetching course data (university course catalogues etc)
Recommendation and optimisation Algorithms: To analyse users’ preference and recommend suitable combinations
Deployment and Hosting(domain name registration, web hosting service): To make sure that the website is accessible to users
IDE: Visual Studio Code, IntelliJ 
Project Management Tools: Git and Github


## Qualifications

Zhang Yuhao:
NUS Modules
CS1010 Programming Methodology (C Language)
CS2040 Data Structures and Algorithms (Java Language)
DSA1101 Introduction to Data Science (R Language)
DSA2102 Essential Data Analytics Tools: Numerical Computation (R/R studio)
DSA3102 Essential Data Analytics Tools: Convex Optimisation (Python)

Personal Internship (Outside of NUS): Engaged in programming tasks like automating data update using Python, efficient algorithm design and testing.

Extra courses (Outside of NUS): Continued learning of Java and Database

Wang Xiyu:
NUS Modules:
CS1101S Programming Methodology (scheme/javascript)
CS1231S Discrete Mathematics 
CS2030S Programming Methodology II (java)
CS2040S Data Structure and Algorithms (java)
ACC1701 Accounting for Decision Making
BSP1702 Legal Environment in Singapore

External Internship: data visualisation using scripts 
Personal Project development: java mini games

## Software Engineering

The software engineering related techniques that we plan to apply in this project have been listed under the section ‘Tech Stack’. For the front-end web development, we already have some past experience in using HTML and CSS in creating front end pages and plan to further improve our skills in the near future. 

For back-end web development, we have already taken some extra courses outside of NUS to learn more about Java (such as its OOP nature and frameworks like MyBatis and Spring Boot) and Database (such as the common SELECT, INSERT, UPDATE and DELETE queries). For the recommendation algorithm(s), we have taken CS2040/CS2040S and plan to use what we have learnt (GameTree) to come up with an appropriate algorithm. If not, we plan to self study and research more algorithms to come up with solutions for our project. For the remaining techniques in ‘Tech Stack’ that have not been mentioned, we are not very familiar with them now but think that they are useful and essential for our project. Thus, we plan to self study, research and master these techniques on our own to help ourselves to complete the project. In short, we will try our best to make sure that there is strong evidence of Software Engineering in our project.

## Deployment (Instruction & Link) 
Local Deployment Instruction:<br>
1.Clone Github Repository.<br>
&emsp;&emsp;&emsp;&emsp;Open terminal, run command “git clone https://github.com/Wxy2003-xy/NUSplanner”.<br>
2.Run command “cd NUSPlanner”.<br>
3.Run command “cd website”.<br>
4.Run command “npm run dev”. (If there is a missing script error, run command “npm install” first).<br>
Upon Step 4, the terminal should display a local website link that allows entry into the website.<br>

Alternatively, one can access the website using the following link: https://wxy2003-xy.github.io/NUSplanner/
