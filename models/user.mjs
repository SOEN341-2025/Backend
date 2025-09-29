

const getUserById = (id) => {
    // Dummy function to simulate fetching a user by ID
    return { id, name: "John Doe", email: "k6NlQ@example.com" };
}

const getAllUsers = () => {
    // Dummy function to simulate fetching all users
    return [
        { id: 1, name: "John Doe", email: " k6NlQ@example.com" },
        { id: 2, name: "Jane Smith", email: "qP5yV@example.com" },
        { id: 3, name: "Alice Johnson", email: " 0M2QW@example.com" },
    ];
}

export default { getUserById, getAllUsers };
