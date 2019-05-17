export const combineCollectionSnapshot = (
    snapshot: FirebaseFirestore.QuerySnapshot
  ) => {

    if (snapshot.empty) {
      return null;
    }

    const { docs } = snapshot;

    const combinedDocs =  docs.map(doc => { 
      return {
        id: doc.id,
        ...doc.data(), 
      }  
    })

    return combinedDocs;
};