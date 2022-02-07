const serverUrl = "https://8jiwp8kh5sdo.usemoralis.com:2053/server";
const appId = "fMVxsbUgqQFbhqSyzRbNYxpaNlWAeqJDrhM6RiGE";
Moralis.start({
    serverUrl,
    appId
});

Moralis.start({
    serverUrl,
    appId
});
const addr = document.querySelector('.addr');
const logout = document.querySelector('.logout');

// add from here down
async function login() {
    let user = Moralis.User.current();

  
    if (!user) {
        user = await Moralis.authenticate({signingMessage:"Testing First Moralis Dapp"});
        addr.innerHTML = user.get('ethAddress');
        addr.classList.add('add');
        logout.classList.add('remove');
    }
    console.log("logged in user:", user);
    getStats();
}

async function logOut() {
    await Moralis.User.logOut();
    addr.classList.remove('add')
    logout.classList.remove('remove');
    console.log("logged out");

}

document.getElementById("btn-login").onclick = login;
document.getElementById("btn-logout").onclick = logOut;


document.getElementById("btn-get-stats").onclick = getStats;

function getStats() {
    const user = Moralis.User.current();
    if (user) {
        getUserTransactions(user);
    }
    getAverageGasPrices();
}

async function getUserTransactions(user) {
    // create query
    const query = new Moralis.Query("EthTransactions");
    query.equalTo("from_address", user.get("ethAddress"));

    // subscribe to query updates ** add this**
    const subscription = await query.subscribe();
    handleNewTransaction(subscription);

    // run query
    const results = await query.find();
    console.log("user transactions:", results);
}

async function handleNewTransaction(subscription) {
    // log each new transaction
    subscription.on("create", function (data) {
        console.log("new transaction: ", data);
    });
}

async function getAverageGasPrices() {
    const results = await Moralis.Cloud.run("getAvgGas");
    console.log("average user gas prices:", results);

    renderGasStats(results);
}

function renderGasStats(data) {
    const container = document.getElementById("gas-stats");
    container.innerHTML = data
        .map(function (row, rank) {
            return `<li>#${rank + 1}: ${Math.round(row.avgGas)} gwei</li>`;
        })
        .join("");
}
// get stats on page load
getStats();