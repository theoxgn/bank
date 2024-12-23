var express = require('express');
const path = require("path")
const fs = require("fs")

var router = express.Router();
router.get("/", (req, res) => {
    return res.send({
        project:'API v1 Web Service '
    });
});


router.get("/ini-test", (req, res) => {
    console.log("asdasd")
    return res.send({
        project:'API v1 Web Service '
    });
});

// Folder v1
const v1Dir = path.join(__dirname);

// Membaca semua folder dalam direktori v1
fs.readdirSync(v1Dir).forEach(folder => {
    const folderPath = path.join(v1Dir, folder);
    
    // Memastikan folder dan bukan file
    if (fs.lstatSync(folderPath).isDirectory()) {
        const routerFilePath = path.join(folderPath, 'index.js');
        
        // Mencari file index.js dalam folder
        if (fs.existsSync(routerFilePath)) {
            const rout = require(routerFilePath);
            router.use(`/${folder}`, rout); // Menggunakan prefix berdasarkan nama folder
        }

        // Mencari file lain dalam folder
        fs.readdirSync(folderPath).forEach(file => {
            if (file !== 'index.js' && file.endsWith('.js')) {
                const routeFilePath = path.join(folderPath, file);
                const routeRouter = require(routeFilePath);
                router.use(`/${folder}`, routeRouter);
            }
        });
    }
});

module.exports = router;