
const crypto = require("crypto")


exports.generateRandomByte = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(30, (err, buff) => {
            if (err) reject(err);
            const buffString = buff.toString('hex')

            console.log(buffString,"buff")
            resolve(buffString)
        })
    })
}

exports.parseData = (req,res,next) => {
    const { trailer, cast, genres, tags, writers } = req.body
    
    if (trailer) {
      req.body.trailer = JSON.parse(trailer)
    }
    
    if (cast) {
      req.body.cast = JSON.parse(cast)
    }
    if (tags) {
      req.body.tags = JSON.parse(tags)
    }
    if (genres) {
      req.body.genres = JSON.parse(genres)
    }
    if (writers) {
      req.body.writers = JSON.parse(writers)
    }
    next()
}

exports.formatActor = (actor) => {
  const { name, gender, about, _id, avatar } = actor;
  return {
    id: _id,
    name,
    about,
    gender,
    avatar: avatar?.url,
  };
};