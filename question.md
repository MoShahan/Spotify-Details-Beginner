# Problem Statement

Create a Spotify like website with basic CRUD and song listings.

We would like to have the following entities in the application.

## Artists

- Name
- DOB
- Bio

## Songs

- Name
- Date of Release
- Cover (image)

## User

- Name
- Email

## Relationships

- Artist can sing multiple songs
- Song can be sung by multiple artists
- Users can rate a song (rating between 1 - 5)

## Application specifics (minimum requirements)

### Home Screen

- **Top 10 Songs (by Avg Rating)**
  - Show Cover (image), Name, Date of Release, Avg. Rating and all Artists of the song
  - Add a ‘New Song’ button
  - Allow users to rate the Song from this screen
- **Top 10 Artists (by Avg Rating of their Songs)**
  - Show Name, DOB and Avg. Rating

### Add a ‘New Song’

- Screen to ‘add’ a new Song with the necessary fields with existing Artists.
- If the user wants to add a new ‘Artist’ while creating the Song which is not present in the database then he should be able to add new artists from the same screen using Ajax.

## Hints and Tips

1. Please go over the sample mocks for reference
2. Focus on database design; add any join tables / foreign keys. We are fanatic about Normal Forms.
3. We are always on the lookout for best practices. Design/Styling/CSS is not critical; functionality is. We recommend using a framework like Bootstrap for clean UI.
4. Define your own rules for validation; use common sense - also please make a note of the validations which you have added
5. Use upcoming JS frameworks like Vue / React / Angular / Knockout to surprise us.
6. Use Docker / GraphQL and wow us!

## Application Submission

- Commit the Code to your Bitbucket / Github account along with the DB scripts.
- Please add additional screenshots in the repository root to showcase your application
- Please add a readme file to your repository root with instructions

Submit your application on  
https://docs.google.com/forms/d/1dq9t7EHSLMJOSOWAPdhtsPNCGAgWZCXu9d9-Kmwybl8

*(Note: Submissions without github link to assignment will be rejected)*

Kindly email your queries at `hireme+fresh2022@deltax.com` with subject - `Fresher Software Engineer - YOURNAME`.

---

## Sample Mocks for Reference

Note: Design/Styling/CSS is not critical; functionality is.

- Listing Screen
- Add Song
- Add Artist

*(Original document includes mock UI screenshots for these screens.)*

---

## Application evaluation criteria

- DB Design (Table names, Normalization)
- UI Should be well structured
- Application should be functionally complete
- Use appropriate coding standard
- Make regular commits which reflects the progress of assignment

---

## About DeltaX

DeltaX is a Data-Driven Digital Advertising Platform built for Agencies, Advertisers and Small Businesses to optimally buy, track, attribute and report media across digital marketing ecosystem including search, social media, display RTB, Mobile, Video, and other media channels. ([www.deltax.com](https://www.deltax.com)).

We are an engineering-focused company and take pride in our culture. You will work alongside like-minded engineers who are passionate about their job.

### Awards + Recognition

- Largest Facebook Marketing Partner in South-East Asia
- Invited to be part of the BlackBox program in Silicon Valley
- One of the 3 companies chosen for Microsoft Ventures Accelerator Plus Program
- Chosen as TECH30 by YourStory.com as one of the most promising startups in India
- Named in the Top 10 innovative digital startups to watch - Havas UK

### Engineering Culture

Know more about us: https://deltax.com/campus/

### Core Platform / Services

This is the core platform - which is a combination of web application, suite of services (130 at last count), databases, APIs.

**Ad-serving / Tracking**  
This is the core adserver (serving, api - as it's consumed by the core platform) and the tracker (click / impression and event trackers for ads and publishers)

**Backend frameworks**

- .NET Core
- .NET MVC
- Fluent Migration
- WCF
- REST API

**Frontend frameworks**

- Vue.JS

**Database / Storage**

- SQL Server
- AWS ElasticSearch
- Redis (session cache + lookup)
- Amazon S3

### Additional Services

- AWS Lambda

**Backend frameworks**

- Node.js
- Node fiber

**Database / Storage**

- AWS DynamoDB
- AWS ElasticSearch
- AWS S3
- AWS Cloudfront
- AWS ElasticTranscoder

**Cloud Platform**

- Amazon Web Services

**Additional Services**

- AWS Auto-scaling
- AWS ELB
- AWS Route 53
- AWS Lambda

### Mobile App

This is limited functionality of the core platform on mobile

- Ionic Framework
- Flutter Framework

### Engineering Blog

You can follow some of the work we do on our engineering blog - http://engineering.deltax.com/

---

**Source:** [DeltaX Fresher Assignment Google Doc](https://docs.google.com/document/d/1JYi4kgnlUHGxuY-f4aLsyJdh2ruuskFwKHMcD3knPjU/edit)
