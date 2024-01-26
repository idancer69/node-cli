import axios from 'axios';
import readline from 'readline';

const baseURL = 'http://localhost:3005'; // Replace with your server URL
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const getUsers = async () => {
    try {
        const response = await axios.get(`${baseURL}/users`)
        if (response.data.length === 0) {
            console.log("No users found.");
            return;
        }
        console.log("\n--- Users List ---");
        response.data.forEach((user, index) => {
            console.log(`${index + 1}. ID: ${user.id} | Username: ${user.username} | Email: ${user.email}`);
        });
    } catch (error) {
        console.error('\nError fetching users:', error.message);
    }
};

const addUser = async () => {
    const username = await question('\nEnter username: ');
    const email = await question('Enter email: ');
    try {
        const response = await axios.post(`${baseURL}/users`, { username, email });
        console.log('\nUser added:', response.data);
    } catch (error) {
        console.error('\nError adding user:', error.message);
    }
};

const updateUserById = async () => {
    const id = await question('\nEnter user ID to update: ');
    const username = await question('Enter new username (leave blank to keep current): ');
    const email = await question('Enter new email (leave blank to keep current): ');
    try {
        const userToUpdate = (await axios.get(`${baseURL}/users/${id}`)).data;
        const updatedUser = {
            ...userToUpdate,
            username: username || userToUpdate.username,
            email: email || userToUpdate.email
        };
        const response = await axios.put(`${baseURL}/users/${id}`, updatedUser);
        console.log('\nUser updated:', response.data);
    } catch (error) {
        console.error('\nError updating user:', error.message);
    }
};

const mainMenu = async () => {
    console.log("\n--- Main Menu ---");
    console.log("(1) Show all users");
    console.log("(2) Add new user");
    console.log("(3) Edit user");
    console.log("(Esc) Exit");

    const choice = await question('\nEnter your choice: ');
    switch (choice) {
        case '1':
            await getUsers();
            break;
        case '2':
            await addUser();
            break;
        case '3':
            await updateUserById();
            break;
        case 'Esc':
        case 'esc':
            console.log('\nExiting...');
            rl.close();
            return;
        default:
            console.log('\nInvalid choice');
    }
    await mainMenu(); // Loop back to main menu
};

mainMenu();