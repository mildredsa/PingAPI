const express = require('express');
const app = express();
const PORT = 8080;

app.use(express.json());

const fs = require('fs');

// Load data from file on server start
let parents = loadDataFromFile('parents.json');
let children = loadDataFromFile('children.json');
let admin = loadDataFromFile('admin.json');

// ... Your routes and other code ...

function saveDataToFile(fileName, data) {
    try {
      fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error saving data to file ${fileName}:`, error.message);
    }
  }
  
  function loadDataFromFile(fileName) {
    try {
      const data = fs.readFileSync(fileName, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Log or handle the error
      console.error(`Error loading data from file ${fileName}:`, error.message);
      // Return an empty array in case of an error
      return [];
    }
  }
  

// Gracefully handle process termination and save data to file
process.on('SIGINT', () => {
  saveDataToFile('parents.json', parents);
  saveDataToFile('children.json', children);
  saveDataToFile('admin.json', admin);
  process.exit();
});

// Start your server
// ...


app.listen(
    PORT,
    () => console.log(`Server is running on http://localhost:${PORT}`)
);



//Parent


// get all parents
app.get('/parents', (req, res) => {
    res.status(200).json(parents);
});


// get a specific parent by parent key
app.get('/parents/:parentkey', (req, res) => {
    const { parentkey } = req.params;
    const parent = parents.find(p.parentkey === parentkey);

    if (!parent) {
        res.status(404).json({ message: 'Parent not found' });
        return;
    }

    res.status(200).json(parent);
});

const generateRandomKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 6; i++) {
        key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
};

const isKeyUnique = (key) => {
    return !parents.some(parent => parent.parentkey === key);
};


// create parent
app.post('/parents', (req, res) => {
    const { name, email, num, pass, cpass } = req.body;

    let parentkey;
    do {
        parentkey = generateRandomKey();
    } while (!isKeyUnique(parentkey));

    const newParent = {
        parentkey,
        name,
        email,
        num,
        pass,
        cpass
    };

    parents.push(newParent);

    res.status(201).json(newParent);
});



// update parent
app.put('/parents/:parentkey', (req, res) => {
    const { parentkey } = req.params;
    const { pass, cpass, name, email, num } = req.body;

    const index = parents.findIndex(p => p.parentkey === parentkey);

    if (index === -1) {
        res.status(404).json({ message: 'Parent not found' });
        return;
    }

    // Retain existing values for fields other than pass and cpass
    const updatedParent = {
        ...parents[index], 
        pass: pass !== undefined ? pass : parents[index].pass,
        cpass: cpass !== undefined ? cpass : parents[index].cpass,
        name: name !== undefined ? name : parents[index].name,
        email: email !== undefined ? email : parents[index].email,
        num: num !== undefined ? num : parents[index].num,
    };

    parents[index] = updatedParent;

    res.status(200).json(updatedParent);
});



// delete parent
app.delete('/parents/:parentkey', (req, res) => {
    const { parentkey } = req.params;

    const index = parents.findIndex(p => p.parentkey === parentkey);

    if (index === -1) {
        res.status(404).json({ message: 'Parent not found' });
        return;
    }

    const deletedParent = parents.splice(index, 1);

    res.status(200).json({ message: 'Parent deleted', deletedParent });
});




//Child


// Get all child
app.get('/children', (req, res) => {
    res.status(200).json(children);
});


// Get a specific parent by parent key
app.get('/children/:id', (req, res) => {
    const { id } = req.params;
    const child = children.find(c => c.id === id);


    if (!child) {
        res.status(404).json({ message: 'Child not found' });
        return;
    }

    res.status(200).json(child);
});


// create child
app.post('/children', (req, res) => {
    const { parentkey, name, email, num, gender, birthday } = req.body;

    let id;
    let counter = 1;

    do {
        id = `${parentkey}${counter}`;
        counter++;
    } while (!isKeyUnique(id));

    const newChild = {
        id,
        parentkey,
        name,
        email,
        num,
        gender,
        birthday
    };

    children.push(newChild);

    res.status(201).json(newChild);
});


// update child
app.put('/children/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, num, gender, birthday } = req.body;

    const index = children.findIndex(c => c.id === id);

    if (index === -1) {
        res.status(404).json({ message: 'Child not found' });
        return;
    }

    // Retain existing values and update only the provided fields
    const updatedChild = {
        ...children[index],
        name: name !== undefined ? name : children[index].name,
        email: email !== undefined ? email : children[index].email,
        num: num !== undefined ? num : children[index].num,
        gender: gender !== undefined ? gender : children[index].gender,
        birthday: birthday !== undefined ? birthday : children[index].birthday,
    };

    children[index] = updatedChild;

    res.status(200).json(updatedChild);
});


// delete child
app.delete('/children/:id', (req, res) => {
    const { id } = req.params;

    const index = children.findIndex(c => c.id === id);

    if (index === -1) {
        res.status(404).json({ message: 'Child not found' });
        return;
    }

    const deletedChild = children.splice(index, 1);

    res.status(200).json({ message: 'Child deleted', deletedChild });
});


//Admin

// get all admin
app.get('/admin', (req, res) => {
    res.status(200).json(admin);
});

// get a specific admin by emp id
app.get('/admin/:empid', (req, res) => {
    const { empid } = req.params;
    const foundAdmin = admin.find(a => a.empid === empid);

    if (!foundAdmin) {
        res.status(404).json({ message: 'Employee not found' });
        return;
    }

    res.status(200).json(foundAdmin);
});


// update admin
app.put('/admin/:empid', (req, res) => {
    const { empid } = req.params;
    const { pass, cpass, name, email, num } = req.body;

    const index = admin.findIndex(a => a.empid === empid);

    if (index === -1) {
        res.status(404).json({ message: 'Employee not found' });
        return;
    }

    // Retain existing values for fields other than pass and cpass
    const updatedAdmin = {
        ...admin[index], 
        pass: pass !== undefined ? pass : admin[index].pass,
        cpass: cpass !== undefined ? cpass : admin[index].cpass,
        name: name !== undefined ? name : admin[index].name,
        email: email !== undefined ? email : admin[index].email,
        num: num !== undefined ? num : admin[index].num,
    };

    admin[index] = updatedAdmin;

    res.status(200).json(updatedAdmin);
});

