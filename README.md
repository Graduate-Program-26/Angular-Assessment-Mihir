# Music App
This is a high-performance music exploration platform built with Angular 21, designed to provide a seamless, accessible, and reactive interface for the Deezer API. This project prioritises modern Angular patterns, moving away from legacy decorators and modules in favor of a Signals-first state management architecture.

---

## Table of Contents

- [App Overview](#app-overview)
- [Lighthouse Performance](#lighthouse-performance)
- [Conclusion](#conclusion)

---
## App Overview
### Home Page
When you first open the website, you will see the following home page that shows recently viewed artist, recently played songs, top tracks, top artists, etc. 

![Home Page](./public/screenshots/home.png)

### Search Page
On the search page you can search by artist, album or even song title as seen below:

![Search Page](./public/screenshots/search.png)

As you can see above, there is a navigation bar to the side with options for a search page, trending page, dashboard page, recent searches and settings which include theme toggling and signing out. 

### Artist Page
If an artist is selected above then you will be brought to a page that looks like the one below:

![Artist Page 1](./public/screenshots/artist.png)
![Artist Page 2](./public/screenshots/artist2.png)

As you can see above the artist page contains top tracks as well as the entire discography of the artist which is also filterable.

### Album Page
If you select an album then you will be brought to a page like this where you can view and play the songs on that album:

![Album Page](./public/screenshots/album.png)

### Playlist Page
The playlist page is similar to the album page but it is a page that shows the songs that you have added as a user:

![Playlist Page](./public/screenshots/playlist.png)

### Mobile Responsiveness
This application has been designed with mobile responsiveness in mind and this can be seen below:

![Mobile View 1](./public/screenshots/mobile.png)

## Lighthouse Performance
Below you can see the lighthouse performance scores. The overall performance is excellent with a score of 94. It was a technical constraint to achieve 100% accessibility which can be seen below:

![Lighthouse Performance](./public/screenshots/lighthouse.png)