import axios from 'axios';

// Admin only
export const getTreasures = () => {
    return axios.get(`/api/treasure/all`);
};

export const getTreasure = (userId) => {
    return axios.get(`api/treasure/new/${userId}`);
};

export const destroyTreasure = (treasureId) => {
    return axios.delete(`api/treasure/${treasureId}`);
}

export const addTreasure = (treasure) => {
    if (treasure.type === "media") {
        return axios.post('/api/treasure/upload', treasure, {
            headers: {
              'accept': 'application/json',
              'Accept-Language': 'en-US,en;q=0.8',
              'Content-Type': `multipart/form-data; boundary=${treasure._boundary}`,
            }
        })
    } else {
        return axios.post('/api/treasure/upload', treasure)
    }
};

// to delete once full update works; need to refactor a little
export const editTreasure = (treasure) => {
    return (
        axios.put(`/api/treasure/edit/${treasure.id}`, treasure)
    );
}

//full update, jenn needs this
export const updateTotalTreasure = (treasure) => {
    return (
        axios.put(`/api/treasure/update/${treasure.id}`, treasure)
    )
}

export const getUserTreasures = (userId) => {
    return axios.get(`api/treasure/collection/${userId}`);
};

export const resetOwners = () => {
    return axios.put('api/treasure/resetowners')
}
