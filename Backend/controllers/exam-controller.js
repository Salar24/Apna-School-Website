const HttpError = require ('../models/http-error');
const Exam = require('../models/exam.model');
const Marks = require('../models/marks.model');

const createExam = async(req, res, next) => {
    const date = req.body.date;
    const subject = req.body.subject;
    const totalMarks = req.body.totalMarks;
    const venue = req.body.venue;

    exam = new Exam ({date, subject, totalMarks, venue});
    exam
      .save()
      .then(() => res.json({ message: "Exam added!", Exam: exam }))
      .catch((err) => res.status(400).json("Error: " + err));
    
}


const getAllExams = async (req, res, next) => {
  if (await Exam.exists()) {
    Exam.find()
      .populate("teacherId")
      .populate("classId")
      .populate("marks")
      .then((exams) => res.status(201).json(exams))
      .catch((err) => res.status(400).json("Error: " + err));
  }
  else{
    return next(new HttpError("No exams found", 404));
  }
};

//update exam title, venue etc
const updateExam = async (req, res, next) => {
  const id = req.params.examId;
  if (id == null) {
    return next(new HttpError("No exams found", 404));
  }
  const updates = req.body;
  Exam.findOneAndUpdate(id, updates).then(() =>
    res.json("Exam updated successfully!")
  );
};

// add marks for a student for an exam
const addMarks = async(req, res, next) => {
    const examId = req.params.examId;
    const obtainedMarks = req.body.obtainedMarks;
    const studentId = req.body.studentId? req.body.studentId : null;
    const mark = new Marks({obtainedMarks, studentId});
    mark.save();

    const exam = await Exam.findById(examId);
    if (exam == null){
        return next(new HttpError("No exams found", 404));
    }
    //before entering marks, we need to check if marks for that student are already present
    for (let i=0; i<exam.marks.length; i++){
        temp_mark = await Marks.findById(exam.marks[i]);
        if (temp_mark.studentId == studentId){
            return next(new HttpError("Marks already present for the student", 409));
        }
    }

    exam.marks.push(mark._id);
    exam
      .save()
      .then(() => res.json({ message: "Marks added to exam!", Exam: exam }))
      .catch((err) => res.status(400).json("Error: " + err));
}

//update marks for a student in an exam
const updateMarks = async(req, res, next) => {
    const examId = req.params.examId;
    const studentId = req.body.studentId;
    const obtainedMarks = req.body.obtainedMarks;

    const exam = await Exam.findById(examId);
    if (exam == null){
        return next(new HttpError("No exams found", 404));
    }
    
    for (let i=0; i<exam.marks.length; i++){
        temp_mark = await Marks.findById(exam.marks[i]);
        if (temp_mark.studentId == studentId){
            temp_mark.obtainedMarks = obtainedMarks;
            temp_mark
                .save()
                .then(() => res.status(200).json({ message: "Marks updated successfully!", Marks:temp_mark }))
                .catch((err) => res.status(400).json("Error: " + err));
            return;
        }
    }
    //if marks were not updated
    res.status(400).json({message: "Marks were not updated!"});
    
}

exports.createExam = createExam;
exports.getAllExams = getAllExams;
exports.updateExam = updateExam;
exports.addMarks = addMarks;
exports.updateMarks = updateMarks;