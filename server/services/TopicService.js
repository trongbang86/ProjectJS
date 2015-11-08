var Project, Topic, logger;

module.exports = function(__Project__){
	Project = __Project__;
	Topic = Project.Models.Topic;
};

module.exports.save = function(fields, cb){
	new Topic(fields).save().
			then(function(topic){ 
				!cb || cb(null, topic);
			}).
			catch(function(error){
				cb(error, null);
			});
}