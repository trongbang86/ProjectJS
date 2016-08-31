The purpose is to create a simple app that shows an HTML form with a number of fields. Validations and some basic server processing will take place. Most importantly, some test cases using protractor will be used against the form.

After setting up the environment as outlined in [ProjectJS], you can run `gulp testE2e` to run the whole thing. Alternatively, you can run the components separately. Open 3 different console windows, `cd` to the project's folder and run each of the following commands there.

1. `NODE_ENV=development DEBUG=express,ProjectJS gulp run`
2. `webdriver-manager start`
3. `./node_modules/protractor/bin/protractor  --specs test/test-e2e/**/*.spec.js test/test-e2e/protractor.conf.js`

![Alt screenshot](docs/screenshot.PNG?raw=true)

## Protractor Test Cases
They are located under _test/test-e2e_ folder. They will be explained below.

1. _submit_form.spec.js_
This submits a valid form and checks if the new screen has a header &lt;h1&gt; with the value 'Form Submitted'

2. _invalid_form.spec.js_
This submits an invalid form with missing First Name.

3. _invalid_form_refactored.spec.js_
This dynamically adds test cases for missing First Name, Email Address and Work Phone Number.
