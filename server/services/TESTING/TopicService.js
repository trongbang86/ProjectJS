var Project, Topic, logger, 
	methods = {};

module.exports = function(__Project__){
	Project = __Project__;
	Topic = Project.Models.Topic;
	return methods;
};

methods.save = function(fields, cb){
	new Topic(fields).save().
			then(function(topic){ 
				!cb || cb(null, topic);
			}).
			catch(function(error){
				cb(error, null);
			});
}