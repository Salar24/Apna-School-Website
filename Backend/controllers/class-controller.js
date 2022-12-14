const HttpError = require('../models/http-error');
let Section = require('../models/section.model');
let Student = require('../models/student.model');
let Class = require('../models/class.model');
let Teacher = require('../models/teacher.model')


const getClass = async (req, res, next) => {
    try {
        console.log("hit")
      const classYear={classYear:req.params.classYear};
      Class.findOne(classYear)
      .then((tempclass) => res.status(201).json(tempclass))
      .catch((err) => res.status(401).json("Error: " + err));
    }
    catch(err) {
      return next(new HttpError(err.message, 401));
    }
  };


const addClass = async(req, res, next) => {
    const class_query = {classYear : req.body.classYear}
    const tempClass = await Class.findOne(class_query)
    if(tempClass !== null)
    {
    if(tempClass.classYear === req.body.classYear)
    {
        console.log("in the check")
        res.status(200).json(1)
        return
    }
}
const classYear = req.body.classYear;
const classStrength = req.body.classtrength? req.body.classStrength : 0;
const noOfSections = req.body.noOfSections? req.body.noOfSections : 0;
//Lectures belonging to that section
const sectionList = req.body.sectionList? req.body.sectionList: null
const newClass= new Class({

    classYear, classStrength, noOfSections, sectionList

                             });


 newClass
 .save()
 .then(() => res.status(201).json({ message: "Class added!",Class: newClass }))
 .catch((err) => res.status(401).json("Error: " + err));
};


const addNewSectionToClass = async(req, res, next) => {
        console.log("here")
        const sectionName = req.body.sectionName;
        console.log(sectionName)
        if(sectionName === null)
        {
            res.status(201).json(1)
            return
        }
        const classYear = req.body.classYear;
        const strength = req.body.strength? req.body.strength: 0;
        //Lectures belonging to that section
        const lectures = req.body.lectures? req.body.lectures: null;
        //Students belonging to that section
        const studentIdList = req.body.studentIdList? req.body.studentIdList: null;
        //Section head, also knows as Class Teacher informally
        const sectionHead = req.body.sectionHead? req.body.sectionHead: null;
        //Finding the class and checking for duplicate section
        const class_query = {classYear : req.body.classYear}
        const temp_class = await Class.findOne(class_query).populate('sectionList');
        if(temp_class.sectionList !== null)
        {
            console.log("Null check passed")
            for(let i=0;i<temp_class.sectionList.length; i++)
            {
                if(temp_class.sectionList[i].sectionName === sectionName)
                {
                    console.log("Section already exists")
                    res.status(201).json(1)
                    return
                }
            }
        }

        const newSection= new Section({

           sectionName, strength, lectures, studentIdList, sectionHead, classYear

                                    });


        newSection.save();

      
        console.log(temp_class)
     if(temp_class.noOfSections !== null)
     {
     temp_class.noOfSections = temp_class.noOfSections + 1;
     }

        temp_class.sectionList = temp_class.sectionList || [];
        temp_class.sectionList.push(newSection._id);
        temp_class.save()
      .then(() => res.status(201).json({ message: "New Section has been added to class", Class: temp_class }))
      .catch((err) => res.status(401).json("Error: " + err));
};

const assignTeacherToSection = async(req, res, next) => {
    let success = -1;
    const class_year = req.body.classYear;
    const section = req.body.section;
    const teacherUsername = req.body.username;
    const temp_teacher = await Teacher.findOne({ username: teacherUsername });

    const temp_class = await Class.findOne({classYear: class_year}).populate('sectionList');

    if (temp_teacher !== null) {
        if (temp_class.sectionList !== null) {
            for (let i = 0; i < temp_class.sectionList.length; i++) {
                if (temp_class.sectionList[i].sectionName === section) {
                    temp_class.sectionList[i].sectionHead = temp_teacher._id;
                    const temp_section = await Section.findOne({_id: temp_class.sectionList[i]._id})
                    temp_section.sectionHead = temp_teacher._id;
                    await temp_section.save();
                    if (temp_teacher.sections.find(val => val === temp_class.sectionList[i]._id) === undefined)
                        temp_teacher.sections.push(temp_class.sectionList[i]._id);
                    success = 1;
                }

                
            }
        }
    }

    if (success === 1){
        await temp_teacher.save()
        const err = await temp_class.save().catch(err => err)
        .then(() => res.status(200).json({ message: "Teacher has been assigned to class", Class: temp_class }))
        .catch((err) => res.status(400).json("Error: " + err));
       
    }
    else{
        res.status(400).json({message: "Teacher was NOT assigned"});
    }

}
const getAllClasses = async (req,res,next) => {
    try {
        Class.find().populate('sectionList')
        .then((classes) => res.status(201).json(classes))
        .catch((err) => res.status(401).json("Error: " + err));
    } catch(err) {
        return next (new HttpError(err.message,500));
    }
    };

const getAllSectionsInClass = async(req ,res , next) => {
    const class_query = {classYear:req.params.classYear}
    const temp_class = await Class.findOne(class_query).populate('sectionList');
    if(temp_class === null)
    {
        res.status(401).json(class_query)
        return
    }
    temp_class.sectionList = temp_class.sectionList || [];
    res.status(201).json(temp_class.sectionList);
    return
};

const deleteClass = async(req,res,next) => {
    const class_query = { classYear: req.body.classYear };
    console.log(class_query)
    const tempClass = await Class.findOne(class_query).populate('sectionList');

    if(tempClass.sectionList === null)
    {
        console.log("yeah xd")
        const classDelete = await Class.findByIdAndDelete(tempClass._id)
        res.status(201).json(1)
        return;
    }
    console.log("before loop")
    for (let i = 0; i < tempClass.sectionList.length; i++) {
            console.log("Section matched")
            const tempSection = await Section.findById(tempClass.sectionList[i]._id).populate('studentIdList');
            if(tempSection.studentIdList !== null)
            {
            for (let j = 0; j < tempSection.studentIdList.length; j++) {
                const tempStudent = await Student.findById(tempSection.studentIdList[j]._id);
                tempStudent.classYear = 0;
                tempStudent.sectionName = 'None';
                tempStudent.save();
            }
        }
    }
    const delCheck = await Section.deleteMany({classYear : req.body.classYear})
    const delCheck2 = await Class.findByIdAndDelete(tempClass._id)
    res.status(201).json(1)
    
}


const deleteSection = async(req,res,next) => {
   const section_query = { classYear : req.body.classYear}
   const section_query2 = {sectionName : req.body.sectionName}
   console.log(section_query)
   console.log(section_query2)
   const tempSection = await Section.findOne({"sectionName" : req.body.sectionName, "classYear" : req.body.classYear}).populate('studentIdList')
   if(tempSection.studentIdList === null)
   {
    console.log("Students dont exist")
    const delCheck1 = await Section.findByIdAndDelete(tempSection._id)
    const tempClass = await Class.findOne(section_query)
    tempClass.noOfSections = tempClass.noOfSections -1;
    tempClass.save();
    console.log("here")

    const teachers = await Teacher.find();
    if (teachers !== null && Array.isArray(teachers) && teachers.length > 0 ){
       // console.log("here 1")
        for (var i=0; i<teachers.length; i++){
            if (teachers[i].sections !== null && Array.isArray(teachers[i].sections) && teachers[i].sections.length>0){
           //     console.log("here 2")
                for (var j=0; j<teachers[i].sections.length; j++){
              //      console.log("here 3")
                    if (String(teachers[i].sections[j]) == String(tempSection._id) ){
                //        console.log("here 4")
                        const temp_list = teachers[i].sections.filter(item=>String(item) != String(tempSection._id));
                 //       console.log("TEMP_list: ", temp_list)
                        teachers[i].sections = temp_list
                        await teachers[i].save();
                    }
                }
            }
        }
    }
    res.status(201).json(3)
    return
   }
   for(let i = 0 ; i < tempSection.studentIdList.length; i++)
   {
        const tempStudent = await Student.findById(tempSection.studentIdList[i]._id);
        tempStudent.classYear = 0;
        tempStudent.sectionName = 'None';
        tempStudent.save();
    
   }
   const delCheck2 = await Section.findByIdAndDelete(tempSection._id)
   const tempClass = await Class.findOne(section_query)
    tempClass.noOfSections = tempClass.noOfSections -1;
    tempClass.save();
   res.status(201).json(3)
   return
}

const getAllStudentsInClass = async(req,res,next) => {
    if (req.params.classYear !==  null){
        const class_query = {classYear :  req.params.classYear}
        const student_list = await Student.find(class_query)
        if (Array.isArray(student_list) && student_list.length > 0)
            return res.status(201).json(student_list)
        else 
            return res.status(404).json({message: "No students were found"})
    }
    else {
        return res.status(400).json({message: "Invalid request"})
    }
}

const getAllSectionsInClassByClassYear = async(req,res,next) => {
    const class_query = {classYear : req.params.classYear}
    const sectionList = await Section.find(class_query)
    if(sectionList.length !== 0)
    {
    console.log("Not null" )
    res.status(201).json(sectionList)
    return
    }
    if(sectionList.length === 0)
    {
        console.log("null")
        res.status(401).json(1)
        return
    }
    
}

exports.getAllSectionsInClassByClassYear = getAllSectionsInClassByClassYear
exports.getAllStudentsInClass = getAllStudentsInClass
exports.deleteSection = deleteSection;
exports.deleteClass = deleteClass;
exports.assignTeacherToSection = assignTeacherToSection;
exports.getAllSectionsInClass = getAllSectionsInClass;
exports.getAllClasses = getAllClasses;
exports.addClass = addClass;
exports.addNewSectionToClass = addNewSectionToClass;
exports.getClass = getClass;

