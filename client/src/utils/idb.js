export function idbPromise(storeName, method, object) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open('colossal-closer', 1)
      // create variables to hold reference to the database, transaction (tx), and object store
      let db, tx, store
      // if version has changed (or if this is the first time using the database), run this method and create the three object stores 
      request.onupgradeneeded = function(e) {
        const db = request.result
  
        db.createObjectStore('customers', {autoIncrement: true})
        db.createObjectStore('transactions', {autoIncrement: true})
        db.createObjectStore('pendingCustomers', {autoIncrement: true})
        db.createObjectStore('pendingTransactions', {autoIncrement: true})
      }
  
      request.onerror = function(e) {
        console.log("Error accessing IndexedDB!")
      }
  
      request.onsuccess = function(e) {
        db = request.result
        tx = db.transaction(storeName, 'readwrite')
        store = tx.objectStore(storeName)
        db.onerror = function(e) {
          console.log('error',e)
        }
        switch (method) {
          case 'put':
            store.put(object)
            resolve(object)
            break
          case 'get':
            const all = store.getAll()
            all.onsuccess = () => resolve(all.result)
            break
          case 'delete':
            store.delete(object._id)
            break
          default:
            console.log('No valid method')
            break
        }
  
        tx.oncomplete = function() {
          db.close()
        }
      }
    })
  }