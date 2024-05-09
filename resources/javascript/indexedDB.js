const db = new Dexie("genki_study_resources");
db.open()
function createStore(store, dataset) {
    if (db._dbSchema[store]) {
        console.log(`Store ${store} already exists`);
    }
    else {
        db.version(1).stores({
            [store]: "\n" + Object.keys(dataset).join(",\n")
        });
    }
}

async function saveToStore(store, input) {
    await db.table(store).bulkPut([...input].map(({ dataset }, id) => {
        return {
            id,
            ...Object.assign({}, dataset)
        }
    }))
}