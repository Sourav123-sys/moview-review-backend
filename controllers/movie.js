const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movie");
const { formatActor } = require("../utils/helper");
//const cloudinary = require("../Cloudinary/Cloud");

const cloudinary = require('cloudinary').v2

cloudinary.config({
    cloud_name: process.env.CLOUD_API_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true
});

exports.uploadTrailer = async (req, res) => {
    const { file } = req

    if (!file) {
        return res.status(200).json({ error: "video file is missing" })
    }

    const videoRes = await cloudinary.uploader.upload(file.path, { resource_type: "video" })
    //console.log(videoRes, 'video res')

    const { secure_url: url, public_id } = videoRes

    res.status(201).json({ url, public_id })
}

exports.createMovie = async (req, res) => {
    const { file, body } = req

    const { title, storyLine, director, releaseDate, status, type, genres, tags, cast, writers, trailer, language } = body
//console.log(body,"body from create movie");
    const newMovie = new Movie({
        title, storyLine, releaseDate, status, type, genres, tags, cast, trailer, language
    })

    if (director) {
        if (!isValidObjectId(director)) {
            return res.status(200).json({ error: "Invalid director id" })
        }

        newMovie.director = director;
    }

    if (writers) {
        for (let writerId of writers) {
            if (!isValidObjectId(writerId))
                return res.status(200).json({ error: "Invalid writer id" })
        }

        newMovie.writers = writers;
    }


    if (file) {

        const posterRes = await cloudinary.uploader.upload(file.path, {
            transformation: {
                width: 1280,
                height: 720,
            },
            responsive_breakpoints: {
                create_derived: true,
                max_width: 640,
                max_images: 3,
            },
        });
    
    
        const { secure_url: url, public_id, responsive_breakpoints } = posterRes
    
        const finalPoster = { url, public_id, responsive: [] }
    
        const { breakPoints } = responsive_breakpoints[0]
        if (breakPoints?.length) {
            for (let imgObj of breakPoints) {
                const { secure_url } = imgObj
                finalPoster.responsive.push(secure_url)
            }
        }
        newMovie.poster = finalPoster
    
        //console.log(posterRes, 'posterRes ')
        //console.log(posterRes.responsive_breakpoints[0].breakpoints);
    }

    

    await newMovie.save()

    res.status(201).json({
        id: newMovie._id,
        title
    })
}

exports.updateMovieWithOutPoster = async (req, res) => {
    const { id } = req.params
    const movieId = id
    if (!isValidObjectId(movieId)) {
        return res.status(200).json({ error: "Invalid movie id" })
    }
    const movie = await Movie.findById(movieId)
    if (!movie) {
        return res.status(200).json({ error: "movie not found" })
    }

    const { title, storyLine, director, releaseDate, status, type, genres, tags, cast, writers, trailer, language } = req.body


    movie.title = title
    movie.tags = tags
    movie.storyLine = storyLine
    movie.status = status
    movie.language = language
    movie.rereleaseDate = releaseDate
    movie.type = type
    movie.cast = cast
    movie.trailer = trailer
    movie.genres = genres


    if (director) {
        if (!isValidObjectId(director)) {
            return res.status(200).json({ error: "Invalid director id" })
        }

        movie.director = director;
    }

    if (writers) {
        for (let writerId of writers) {
            if (!isValidObjectId(writerId))
                return res.status(200).json({ error: "Invalid writer id" })
        }

        movie.writers = writers;
    }
    await movie.save()

    res.json({ message: "Movie is updated successfully", movie })
}


// exports.updateMovieWithPoster = async (req, res) => {
//     const { id } = req.params
//     const movieId = id
//     if (!isValidObjectId(movieId)) {
//         return res.status(200).json({ error: "Invalid movie id" })
//     }
//     if (!req.file) {
//         return res.status(200).json({ error: "Movie poster  is missing" })
//     }
//     const movie = await Movie.findById(movieId)
//     if (!movie) {
//         return res.status(200).json({ error: "movie not found" })
//     }

//     const { title, storyLine, director, releaseDate, status, type, genres, tags, cast, writers, trailer, language } = req.body


//     movie.title = title
//     movie.tags = tags
//     movie.storyLine = storyLine
//     movie.status = status
//     movie.language = language
//     movie.releaseDate = releaseDate
//     movie.type = type
//     movie.cast = cast
//     movie.trailer = trailer
//     movie.genres = genres


//     if (director) {
//         if (!isValidObjectId(director)) {
//             return res.status(200).json({ error: "Invalid director id" })
//         }

//         movie.director = director;
//     }

//     if (writers) {
//         for (let writerId of writers) {
//             if (!isValidObjectId(writerId))
//                 return res.status(200).json({ error: "Invalid writer id" })
//         }

//         movie.writers = writers;
//     }

//     const posterId = movie?.poster?.public_id
//     if (posterId) {
//         const { result } = cloudinary.uploader.destroy(posterId)
//         //console.log(result, 'result from update with poster')

//         if (result !== 'ok') {
//             return res.status(200).json({ error: "could not update poster at this moment" })
//         }

//     }


//     const posterRes = await cloudinary.uploader.upload(req.file.path, {
//         transformation: {
//             width: 1280,
//             height: 720,
//         },
//         responsive_breakpoints: {
//             create_derived: true,
//             max_width: 640,
//             max_images: 3,
//         },
//     });



//     const { secure_url: url, public_id, responsive_breakpoints } = posterRes

//     const finalPoster = { url, public_id, responsive: [] }

//     const { breakPoints } = responsive_breakpoints[0]
//     if (breakPoints.length) {
//         for (let imgObj of breakPoints) {
//             const { secure_url } = imgObj
//             finalPoster.responsive.push(secure_url)
//         }
//     }
//     movie.poster = finalPoster


//     await movie.save()

//     res.json({ message: "Movie is updated successfully", movie })
// }

exports.removeMovie = async (req, res) => {
    const { id } = req.params
    const movieId = id
    const {poster} =req.body
    console.log(poster,"poster from remove movie");
    if (!isValidObjectId(movieId)) {
        return res.status(200).json({ error: "Invalid movie id" })
    }
    // if (!req.file) {
    //     return res.status(200).json({ error: "Movie poster  is missing" })
    // }
    const movie = await Movie.findById(movieId)
    if (!movie) {
        return res.status(200).json({ error: "movie not found" })
    }
console.log(movie,"movie-remove");
    const public_id = movie?.poster?.public_id
    console.log(public_id, "posterid");
    
    // if (public_id) {
    //     const  { result } =await cloudinary.uploader.destroy(public_id)
    //     console.log(result, 'result from remove with poster')

    //     if (result !== 'ok') {
    //         return res.status(200).json({ error: "could not remove poster from cloud" })
    //     }

    // }
  //console.log(await cloudinary.uploader.destroy(public_id));
    if (public_id) { 
      console.log(public_id, "posterid-enter");
        const   result  =await cloudinary.uploader.destroy(public_id)
        console.log(result.result, 'result from remove with poster')

        if (result.result ==='not found') {
            return res.status(200).json({ error: "could not remove poster from cloud" })
        }

    }

    const trailerId = movie?.trailer?.public_id
    if (!trailerId) {
        return res.status(200).json({ error: "could not found trailer from cloud" })

    }
    const { result } = cloudinary.uploader.destroy(trailerId, {
        resource_type: 'video'
    })
    if (result === 'not found') {
        return res.status(200).json({ error: "could not remove trailer from cloud" })
    }



    await Movie.findByIdAndDelete(movieId)
    res.json({message: 'Movie deleted successfully'})


}


exports.getMovies = async (req, res) => {
    const { pageNo = 0, limit = 10 } = req.query;
    //console.log(pageNo,limit,"from get movies pageno-limit");
    const movies = await Movie.find({})
      .sort({ createdAt: -1 })
      .skip(parseInt(pageNo) * parseInt(limit))
      .limit(parseInt(limit));
  
    const results = movies.map((movie) => ({
      id: movie._id,
      title: movie.title,
      poster: movie.poster?.url,
      responsivePosters: movie.poster?.responsive,
      genres: movie.genres,
      status: movie.status,
    }));
  //console.log(results,"results from get movies");
    res.json({ movies: results });
};
exports.getMovieForUpdate = async (req, res) => {
    const { movieId } = req.params;
  
    if (!isValidObjectId(movieId)) { 
       
        return res.status(200).json({ error: "Id is invalid!" })
    } 
  
    const movie = await Movie.findById(movieId).populate(
      "director writers cast.actor"
    );
  //console.log(movie,"movie-update");
    res.json({
      movie: {
        id: movie._id,
        title: movie.title,
        storyLine: movie.storyLine,
        poster: movie.poster?.url,
        releaseDate: movie.releaseDate,
        status: movie.status,
        type: movie.type,
        language: movie.language,
        genres: movie.genres,
        tags: movie.tags,
        director: formatActor(movie.director),
        writers: movie.writers.map((w) => formatActor(w)),
        cast: movie.cast.map((c) => {
          return {
            id: c.id,
            profile: formatActor(c.actor),
            roleAs: c.roleAs,
            leadActor: c.leadActor,
          };
        }),
      },
    });
};
  
exports.updateMovie = async (req, res) => {
    const { id } = req.params;
    const { file } = req;
  const movieId = id
    if (!isValidObjectId(movieId)) {
        return res.status(200).json({ error: "Invalid Movie ID!" })
    } 
  
    // if (!req.file) return sendError(res, "Movie poster is missing!");
  
    const movie = await Movie.findById(movieId);
    console.log(movie,"update-movie");
    if (!movie) {
        return res.status(200).json({ error: "Movie Not Found!" })
    } 
  
    const {
      title,
      storyLine,
      director,
      releaseDate,
      status,
      type,
      genres,
      tags,
      cast,
      writers,
      trailer,
      language,
    } = req.body;
  
    movie.title = title;
    movie.storyLine = storyLine;
    movie.tags = tags;
    movie.releaseDate = releaseDate;
    movie.status = status;
    movie.type = type;
    movie.genres = genres;
    movie.cast = cast;
    movie.language = language;
  
    if (director) {
      if (!isValidObjectId(director))
      return res.status(200).json({ error: "Id is invalid!" })
      movie.director = director;
    }
  
    if (writers) {
      for (let writerId of writers) {
        if (!isValidObjectId(writerId))
        return res.status(200).json({ error: "Id is invalid!" })
      }
  
      movie.writers = writers;
    }
  
    // update poster
    if (file) {
      // removing poster from cloud if there is any.
        const posterID = movie.poster?.public_id;
        console.log(posterID,"poster id for movie update");
        if (posterID) {
          console.log(posterID,"enter");
          const   result  = await cloudinary.uploader.destroy(posterID);
          console.log(result,"result from update-movie");
        if (result.result === "not found") {
            return res.status(200).json({ error: "Could not update poster at the moment!" });
        }
  
        // uploading poster
        const {
          secure_url: url,
          public_id,
          responsive_breakpoints,
        } = await cloudinary.uploader.upload(req.file.path, {
          transformation: {
            width: 1280,
            height: 720,
          },
          responsive_breakpoints: {
            create_derived: true,
            max_width: 640,
            max_images: 3,
          },
        });
  
        const finalPoster = { url, public_id, responsive: [] };
  
        const { breakpoints } = responsive_breakpoints[0];
        if (breakpoints.length) {
          for (let imgObj of breakpoints) {
            const { secure_url } = imgObj;
            finalPoster.responsive.push(secure_url);
          }
        }
  
        movie.poster = finalPoster;
      }
    }
  
    await movie.save();
  
    res.json({ message: "Movie is updated", movie: {
        id: movie._id,
        title: movie.title,
        poster: movie.poster?.url,
        genres: movie.genres,
        status: movie.status,
      }, });
  };
  exports.searchMovies = async (req, res) => {
    const { title } = req.query;
  
    if (!title.trim()) {
      return res.status(200).json({ error: "invalid request!" });
    } 
  
    const movies = await Movie.find({ title: { $regex: title, $options: "i" } });
    console.log(movies,"search-movies")
    res.json({
      results: movies.map((m) => {
        return {
          id: m._id,
          title: m.title,
          poster: m.poster?.url,
          genres: m.genres,
          status: m.status,
        };
      }),
    });
  };