const drivelist = require('./drivelist.node');

drivelist.list((drives) => {
   console.log(drives)
})
