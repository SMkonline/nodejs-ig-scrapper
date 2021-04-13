const Hashtag = require('../models/hashtag');
const hashtagCtrl = {};

hashtagCtrl.getHashtag = async (hashtag, req, res, client, hours) => {
    let _hashtag = await Hashtag.findOne({ hashtag: hashtag });
    let response;
    if (_hashtag) {
        let now = Math.round(new Date().getTime() / 1000);

        if ((now - _hashtag.timestamp) > hours) {

            await client.login().then(async () => {
                response = await client.getMediaFeedByHashtag({ hashtag: hashtag }).catch((error) => {
                    console.log(error);
                });
    
                const hashtagToUpdate = {
                    hashtag: hashtag,
                    data: response,
                    timestamp: Math.round(new Date().getTime() / 1000)
                }
    
                await Hashtag.findByIdAndUpdate(_hashtag._id, {$set: hashtagToUpdate}, {new: true});
            }).catch(err => {
                return res.json(err.error);
            });
           
        } else {
            response = _hashtag.data;
        }
    } else {
        await client.login().then(async () => {
            response = await client.getMediaFeedByHashtag({ hashtag: hashtag }).catch((error) => {
                console.log(error);
            });
            const hashtagToCreate = new Hashtag({
                hashtag: hashtag,
                data: response,
                timestamp: Math.round(new Date().getTime() / 1000)
            });
    
            await hashtagToCreate.save();
        }).catch(err => {
            return res.json(err.error);
        });
       
    }

    if (response) {
        res.json(response);
    }
    
}

module.exports = hashtagCtrl;