export default class FeedService {
    static getData(feedID) {
        const url = `https://esdr.cmucreatelab.org/api/v1/feeds/${feedID}`;

        return fetch(url)
            .then(response => response.json())
            .then(data => data)
            .catch(error => console.error(error));
    }
}
