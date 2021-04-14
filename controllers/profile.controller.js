const Profile = require('../models/profiles');
const Instagram = require('instagram-web-api')

const profileCtrl = {};

profileCtrl.getProfile = async (profile, req, res, client, hours) => {
  
    let _profile = await Profile.findOne({ profile: profile });
    // console.log(_profile);
    let response;
    if (_profile) {
        
        let now = Math.round(new Date().getTime() / 1000);
       
        if ((now - _profile.timestamp) > hours) {

            // await client.login().then(async () => {
                response = await client.getUserByUsername({ username: profile }).catch(err => console.log(err));

                if (response) {
                    const profileToUpdate = {
                        profile: profile,
                        data: response,
                        timestamp: Math.round(new Date().getTime() / 1000)
                    }
    
                    await Profile.findByIdAndUpdate(_profile._id, {$set: profileToUpdate}, {new: true});
                }
            // }).catch(err => {
            //     return res.json(err.error);
            // });           
        
        } else {
            response = _profile.data;
        }
    } else {
        // await client.login().then(async () => {
            response = await client.getUserByUsername({ username: profile });
            if (response) {
                const profileToCreate = new Profile({
                    profile: profile,
                    data: response,
                    timestamp: Math.round(new Date().getTime() / 1000)
                });
            
                await profileToCreate.save();
            }
        // }).catch(err => {
        //     return res.json(err.error);
        // });
       
    }
    if (response) {
        res.json(response);
    }
}

module.exports = profileCtrl;