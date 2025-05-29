# EduFlow 

EduFlow is an online learning platform that allows users to search, browse, filter, and sort courses by different parameters. This project demonstrates practical skills in working with HTML, CSS, JavaScript, and Sass.

---

## Main Features
- Course search by title
- Filtering and sorting courses by direction, difficulty, and price
- Responsive slider on the homepage
- Dynamic loading of courses with the "Explore More" button
- Fully responsive design for all devices
- Using Sass for styles organization

---

## Technologies Used
- HTML5
- CSS3 / Sass
- JavaScript (ES6+)
- npm

---

## Project Installation

### 1. Clone the repository
```
git clone https://github.com/JuliaBarna/Online-Learning-Platform.git
cd learning_platform
```

### 2. Initialize npm
```
npm init -y
```

### 3. Install Sass
```
npm install sass --save-dev
```

### 4. Add .gitignore file
Create a `.gitignore` file and add the following line:
```
node_modules/
```

### 5. Add SCSS Compilation Script
Open `package.json` and add the following script inside "scripts":
```
"scripts": {
  "compile": "sass assets/styles/scss:assets/styles --watch"
}
```

### 6. Run SCSS Compilation
Run the following command to start SCSS compilation:
```
npm run compile
```

---

## Run the Project

1. Install all dependencies:
```
npm install
```

2. Start SCSS compilation:
```
npm run compile
```

3. Open `index.html` in your browser to view the project.


## Author
Created by: Yuliia Barna

---

## License
This project was created for educational purposes only.
