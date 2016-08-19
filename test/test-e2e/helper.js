/**
 *  Source: https://gist.github.com/trongbang86/ecbfe8b4b500435dc2c8
 */

var self = module.exports;
var fs = require('fs');

/**
 * this looks for a VISIBLE field using its ng-model
 * @param expression
 * @returns {*} an array of matching element
 */
self.visibleArrayElements= function (expression) {
    var method = 'css';
    if(typeof(expression) === 'object'){
        if('css' in expression) method = 'css';
        else if ('xpath' in expression) method = 'xpath';
    } else if (typeof(expression) === 'string'){
        expression= {'css': expression};
    }
    return element.all(by[method](expression[method])).filter(function (element) {
        return element.isDisplayed();
    });
};

/**
 * this fills a visible field with
 * a value using its ng-model property
 */
self.fillValue= function (expression, value){
    var filteredElements = self.visibleArrayElements(expression);
    filteredElements.then(function(items){

        if(items.length ===0) {
            throw new Error("Can't find element["+ expression+"]");
        }

        var item = items[0];
        item.getTagName().then(function(name){
            name = name.trim().toUpperCase();
            switch(name) {
                case 'TEXTAREA':
                case 'INPUT':
                    self.__fillValueInput__(expression, filteredElements, item, value);
                    break;
                case 'SELECT':
                    self.__fillValueSelect__(expression, filteredElements, item, value);
            }
        });

    });
};

/**
 * This goes through the sample data set
 * and sets all the values accordingly
 * @param dataSet
 *          Ex:[
 *              "rfiFormData.solicitorName": 'name',
 *              "rfiFormData.memberNumber": 'memberNumber'
 *          ]
 *
 */
self.fillValues = function(dataSet) {
    for(var key in dataSet){
        (function(modelKey){
            console.log(modelKey);
            self.fillValue(modelKey, dataSet[modelKey]);
        })(key);
    }
};

/**
 * this uses expect to check the value of
 * a visible field looked up using its ng-model property
 * @param expression
 * @param value
 */
self.expectFieldValue= function(expression, value){
    var filteredElements = self.visibleArrayElements(expression);
    filteredElements.then(function(items){
        if(items.length ===0) {
            throw new Error("Can't find element["+expression+"]");
        }
        var item = items[0];
        item.getAttribute('type').then(function(type){
            type = type.trim().toUpperCase();
            switch (type) {
                case '':
                case 'TEXT':
                    item.getAttribute('value').then(function(text){
                        expect(text.trim()).toBe(value);
                    });
                    break;
                case 'RADIO':
                    self.__expectFieldValueRadio__(expression, filteredElements, value);
                    break;
            }

        });

    });
};

/**
 * This uses expect to check the values of
 * all the visible fields specified in the set
 * @param expectedValues the expected data set
 *      Example:
 *      expectedValues: {
 *           "rfiFormData.solicitorName": 'name',
 *           "rfiFormData.memberNumber": 'memberNumber'
 *       }
 */
self.expectFieldsWithValues= function(expectedValues) {
    for(var key in expectedValues){
        (function(modelKey){
            self.expectFieldValue(modelKey, expectedValues[modelKey])
        })(key);

    }
};

/**
 * to check the value of a radio item(s)/group
 * @param expression the lookup query for the item
 * @param filteredElements an array of of group elements
 *                          within the same selection and having
 *                          different values one of which is desired
 * @param value the desired value
 * @param type the type of the item(s)
 * @private
 */
self.__expectFieldValueRadio__ = function(expression, filteredElements, value) {
    filteredElements.filter(function(elem){
        var deferred = protractor.promise.defer();
        elem.getAttribute('value').then(function(val){
            if(val === value){
                deferred.fulfill(true);
            } else {
                deferred.fulfill(false);
            }
        });
        return deferred.promise;
    }).then(function(items){
        expect(items.length === 1).toBeTruthy();
        if(items.length ===0) {
            throw new Error("The search for element["+expression+"] " +
                "with value=["+value+"] results in " + items.length +
                " item(s)");
        }
        expect(items[0].isSelected()).toBeTruthy();
    });
};

/**
 * This method is used to simulate the click of a group element type such as radio, checkboxes
 * @param expression the lookup query for the item
 * @param filteredElements an array of of group elements
 *                          within the same selection and having
 *                          different values one of which is desired
 * @param value the desired value
 * @param type the type can be RADIO or CHECKBOX
 * @private
 */
self.__fillValueGroupType__ = function(expression, filteredElements, value, type) {

    filteredElements.filter(function(elem){
        var deferred = protractor.promise.defer();
        elem.getAttribute('value').then(function(val){
            if(val === value) {
                deferred.fulfill(true);
            } else {
                deferred.fulfill(false);
            }
        });
        return deferred.promise;
    }).then(function(items){

        if(items.length ===0) {
            filteredElements.count().then(function(count){
                if(count === 0) {
                   throw new Error("Can't find "+type+" " +
                       "using expression=[" + expression + "] and" +
                       "value =["+value+"]");
                }

                if(value === true) {
                   filteredElements.each(function(elem){
                       elem.click();
                   })
                }

            });
        } else {
            items[0].click();
        }
    });
};

/**
 * This method is used to fill value of an input element
 * @param expression the lookup query for the item
 * @param filteredElements an array of elements within the same selection
 * @param item the current examined item
 * @param value the desired value
 * @private
 */
self.__fillValueInput__ = function(expression, filteredElements, item, value){

    item.getAttribute('datepicker-popup').then(function(val){
        if(val !== null){
            self.__fillValueDatePicker__(expression, filteredElements, item, value);
        } else {
            self.__fillValueBasicHtmlElement__(expression, filteredElements, item, value);
        }
    });


};

/**
 * This method is used to fill value of a select element
 * @param expression the search query for elements
 * @param filteredElements an array of elements within the same selection
 * @param item the current examined item
 * @param value the desired value
 * @private
 */
self.__fillValueSelect__ = function(expression, filteredElements, item, value){
    var options = filteredElements.all(by.css('option[value="'+value+'"]'));
    options.count().then(function(count){
        if(count !==1) {
            throw new Error('The search for option[value='+value+'] results in ' +
                count + ' item(s). There must be 1 item');
        }
        options.click();
    });
};

/**
 * This method is used to fill value of any basic html element which is, for
 *          example, non-date picker inputs
 * @param expression the search query for elements
 * @param filteredElements an array of elements within the same selection
 * @param item the current examined item
 * @param value the desired value
 * @private
 */
self.__fillValueBasicHtmlElement__ = function(expression, filteredElements, item, value) {
    item.getAttribute('type').then(function(type){
        type = type.trim().toUpperCase();
        switch (type){
            case '':
            case 'EMAIL':
            case 'NUMBER':
            case 'TEXTAREA':
            case 'TEXT':
                item.clear().then(function(){
                    item.sendKeys(value);
                });
                break;
            case 'RADIO':
            case 'CHECKBOX':
                self.__fillValueGroupType__(expression, filteredElements, value, type);
                break;
        }
    });
};

/**
 * This method is used to fill value of a date picker element
 * @param expression the search query for elements
 * @param filteredElements an array of elements within the same selection
 * @param item the current examined item
 * @param value the desired value
 * @private
 */
self.__fillValueDatePicker__ = function(expression, filteredElements, item, value){
    self.__fillValueBasicHtmlElement__(expression, filteredElements, item, value);
};

/**
 * This looks for the button(s) with the matching text
 * and makes a click action on them
 * @param buttonText the desired button text
 */
self.click = function(buttonText) {
    var buttons = self.visibleArrayElements(
        {'xpath': '//button[contains(text(),"'+buttonText+'")]'}
    );
    buttons.then(function(elems){
       for (var i in elems){
           elems[i].click();
       }
    });
};

/**
 * This writes data (image) to a file
 */
self.writeScreenshot = function writeScreenshot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();

};

/**
 * This takes screenshot of the current page
 */
self.takeScreenshot = function (filename) {
    browser.takeScreenshot().then(function (png) {
        helper.writeScreenshot(png, filename);
    });
};

/**
 * This checks if the elements contain the text expected
 * @param elemExpression the expression to filter elements
 * @param expectedText the text expected
 */
self.expectContainText = function (elemExpression, expectedText) {

    self.visibleArrayElements(elemExpression).getText().then(function(text) {
        expect(text).to.contain(expectedText);
    });
};

