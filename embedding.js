const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
    // _id:String,
    name: String,
    bio: String,
    website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
    name: String,
    authors:[authorSchema]
}));

async function createCourse(name, authors) {
    const course = new Course({
        name,
        authors
    });

    const result = await course.save();
    console.log(result);
}

async function listCourses() {
    const courses = await Course.find();
    console.log(courses);
}

async function updateAuthor(courseId) {
const course = await Course.update({_id:courseId},{
    // $set: {
    //     'author.name':'Lirak Iberdemaj'
    // }
});
course.author.name = 'Mosh Hamedani'
course.save();
}

async function addAuthor(courseId,author){
    const course = await Course.findById(courseId);
    course.authors.push();
    course.save();
}

async function removeAuthor(courseId){
    // const course = await Course.findById(courseId);
    // const author = course.authors.id(authorId);
    // author.remove();
    // course.save();
    const courseRemove = await Course.findById(courseId);
    const deleted = await courseRemove.authors.deleteMany();
    course.save();
}
removeAuthor('639b32d062a5834c01e6951e');
// removeAuthor('639b2b9cbaa7acd73a17004a','639b2bc111773edaf4af5558');
// addAuthor('639b2b9cbaa7acd73a17004a', new Author ({name: 'Rrapi'}));

// createCourse('Java Course',[
//     new Author({name:'Lirak'}),
//     new Author({name:'Hysen'})
// ]);
// createCourse('React Course', new Author({ name: 'Mosh' }));
// updateAuthor('639b197d0bb90eed4866009e');
