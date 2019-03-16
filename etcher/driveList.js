// const drivelist = require('drivelist')

// drivelist.list((error, drives) => {
//     if (error) {
//         throw error;
//     }

//     console.log(drives)
// });

const DrivelistScanner = require('drivelist-scanner')

scanner = new DrivelistScanner({interval: 1000})

scanner.on('add', (drives) => {
    console.log(drives)
})

scanner.on('remove', (drives) => {
    console.log(drives)
})