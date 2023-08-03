const { isValidObjectId } = require("mongoose");
const Actor = require("../models/actor");
const { formatActor } = require("../utils/helper");

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_API_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});
console.log(process.env.CLOUD_API_NAME,
    process.env.CLOUD_API_KEY,
    process.env.CLOUD_API_SECRET
    , 'from cloudinary configuration'
)
exports.actorCreate = async (req, res) => {
    const { name, about, gender } = req.body
    //console.log(name, about, gender, "actor-details");
    const { file } = req
    //console.log(file, 'file from create actor')
    const newActor = new Actor({ name, about, gender })


    if (file) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
            gravity: "face",
            height: 500,
            width: 500,
            crop: "thumb"
        })
        //   //console.log(uploadRes, 'uploadRes')
        const { public_id, secure_url } = uploadRes
        newActor.avatar = { url: secure_url, public_id }
    }


    await newActor.save()

    res.status(201).json({ id: newActor._id, name, about, gender, avatar: newActor.avatar?.url })

}

exports.updateActor = async (req, res) => {
    const { name, about, gender } = req.body
    const { file } = req
    const { id } = req.params
    const actorId = id
    //console.log(actorId, 'actorId')
    //console.log(req.body, "from update actor");
    if (!isValidObjectId(actorId)) {
        return res.status(200).json({ error: "Invalid request" })
    }
    const actor = await Actor.findById(actorId)
    if (!actor) {
        return res.status(200).json({ error: "Invalid request.record not found" })
    }

    const public_id = actor.avatar?.public_id

    if (public_id && file) {

        const { result } = await cloudinary.uploader.destroy(public_id)
        //console.log(result, 'result from update actor')
        if (result !== 'ok') {
            return res.status(200).json({ error: "could not remove image from cloud" })
        }

    }
    if (file) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
            gravity: "face",
            height: 500,
            width: 500,
            crop: "thumb"
        })
        //   //console.log(uploadRes, 'uploadRes')
        const { public_id, secure_url } = uploadRes
        actor.avatar = { url: secure_url, public_id }
    }
        actor.name = name,
        actor.about = about,
        actor.gender = gender


    await actor.save()

    res.status(201).json({ actor: formatActor(actor) })

}

exports.deleteActor = async (req, res) => {

    const { id } = req.params
    const actorId = id
    if (!isValidObjectId(actorId)) {
        return res.status(200).json({ error: "Invalid request" })
    }
    const actor = await Actor.findById(actorId)
    if (!actor) {
        return res.status(200).json({ error: "Invalid request.record not found" })
    }
    const public_id = actor.avatar?.public_id

    if (public_id) {

        const { result } = await cloudinary.uploader.destroy(public_id)
        //console.log(result, 'result from update actor')
        if (result !== 'ok') {
            return res.status(200).json({ error: "could not remove image from cloud" })
        }

    }

    await Actor.findByIdAndDelete(actorId)
    res.status(200).json({ message: 'record remove successfully' })
}


exports.searchActor = async (req, res) => {
    const { query } = req;
    //console.log(query, "query search actor");
     const result = await Actor.find({ $text: { $search: `"${query.name}"` } });
    // const result = await Actor.find({ name : {$regex:query.name, $options:'1'}});
//console.log(result,"results from search actor");
    const actors = result.map((actor) => formatActor(actor));
    //console.log(actors, "search actor");
    res.json({ results: actors });
}

exports.latestActors = async (req, res) => {
    const result = await Actor.find().sort({ createdAt: '-1' }).limit(12)
    //console.log(result, 'result from latest actors')
    res.json(result)
}
exports.singleActor = async (req, res) => {
    const { id } = req.params
    const actorId = id
    if (!isValidObjectId(actorId)) {
        return res.status(200).json({ error: "Invalid request" })
    }

    const actor = await Actor.findById(actorId)
    if (!actor) {
        return res.status(200).json({ error: "Invalid request.actor not found" })
    }
    //console.log(actor, 'actor from single actors')
    res.json(actor)
}


exports.getActors = async (req, res) => {
    const { pageNo, limit } = req.query;
    //console.log(pageNo, limit, "pageNo, limit");
    const actors = await Actor.find({})
        .sort({ createdAt: -1 })
        .skip(parseInt(pageNo) * parseInt(limit))
        .limit(parseInt(limit));

    const profiles = actors.map((actor) => formatActor(actor));
    res.json({
        profiles,
    });
    //console.log(profiles, "profiles with pagination");
};