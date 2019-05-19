<img width="130" height="60" src="logo.png" alt="logo" align="left">

**OC-request** is vanilla-js based replacement   for standard OctoberCMS api.
No dependencies. Based on native XMLHttpRequest.

## Contents

  - [Contents](#contents)
  - [Introduction](#introduction)
  - [Installation](#installation)
    - [NPM](#npm)
    - [Usage exmaple](#usage-exmaple)
  - [Methods](#methods)
    - [Events](#events)
  - [Tips for easy migration](#tips-for-easy-migration)
  - [Version history](#version-history)

## Introduction

In modern frontend development, the use of jQuery is less and less encouraged and there are a number of reasons for this. Here are a few of them:
1. Most of the jQuery functionality is easy to write on pure JS.
2. jQuery greatly increases the size of the bundle, with most of the functionality is not used.
3. jQuery encourages writing bad and unreliable code.

On most of my recent projects, I had to add jquery to the bundle just because of the  request() function, so I decided that it was time to remove this vestige. I tried to keep the structure of request creation and response processing as similar as possible to current api. The only thing that has not been implemented is the part of the api that is based on 'data-' attributes. I find this functionality unnecessary and vulnerable due to the use of the eval() method.

## Installation

### NPM

```sh
npm install oc-request --save
```

### Usage exmaple:

```javascript
import request from 'oc-request';

// Send some information
request.sendData('ProductList::onAjaxRequest', {
    data: {
      сategory_id: id,
    },
      update: { 'product/slider/slider-ajax': '.slider-ajax-wrapper' },
      success: () => {
      doSomething();
    },
      complete: () => {
      doSomethingAfterSuccess();
    },
    loading: '.preloader-selector',
});

// Send form
const formNode = document.querySelector('.my-form');

request.sendForm(form, 'MakeReview::onCreate', {
   success: (res) => {
      completeHandler(res);
   },
});
```
## Methods

There are two main methods for **request** object:
1. ***sendData***(handler, options);
2. ***sendForm***(form, handler, options).

The set of options is standard for both and very similar to standard OctoberCMS api

|   Options	|  Default 	| Description
|---	|---	|---	|
|data|null|an optional object specifying data to be sent to the server along with the form data: {var: 'value'}.
|update|null|an object, specifies a list partials and page elements (as CSS selectors) to update: {'partial': '#select'}. If the selector string is prepended with the @ symbol, the content received from the server will be appended to the element at begin or if string contains '^' symbol  - at the end, instead of replacing the existing content.
|flash|false|when true, instructs the server to clear and send any flash messages with the response.
|files|false|when true, the request will accept file uploads, this requires FormData interface support by the browser.
|loading|null|an optional string or object to be displayed when a request runs. The string should be a CSS selector for an element, the object should support the show() and hide() functions to manage the visibility.
|redirect|true|string specifying an URL to redirect the browser to after the successful request.
|success|null|Unlike the standard api, this is the primary method that runs when the query succeeds and runs **AFTER** the update () function. As a parameter, it takes **ONE** parameter - an object with a response from the server. Events are also triggered to indicate the start and end of function processing. You can read about the events below
|error|null|the callback function is executed in case of an error. Accepts error text as a parameter
|complete|null|Executed **AFTER** success or error methods

### Events
All events will be trigger on **document node**;
|   Name	|  Description
|---	|---	|
|ocBeforeUpdateEvent| The event fires before the update() is executed
|ocAfterUpdateEvent|The event fires after the update() is executed and before success() is executed
|ocBeforeSuccessEvent|The event fires before the success() is executed
|ocAfterSuccessEvent|The event fires after the success() is executed
|ocBeforeCompleteEvent|The event fires before the complete() is executed
|ocAfterCompleteEvent|The event fires after the complete() is executed
|ocBeforeRedirectEvent|The event fires before redirect

## Tips for easy migration
1. For **event delegation** there is very [useful library from github developers](https://github.com/dgraham/delegated-events).
2. You may to use [axios](https://github.com/axios/axios) or [fetch](https://developer.mozilla.org/ru/docs/Web/API/Fetch_API) for request to custom request to server.
3. This package is designed for the latest browsers. For better compatibility don't forget to add it for Babel processing.

## Version history

* ***0.1.3*** - Added basic functionality for sending data and updating DOM
* ***0.2.0*** - Migrate from axios to native XMLHttpRequest
* ***0.2.3*** - Add methods for manual files sending
* ***0.3.0*** - Add methods for form serialize and send
* ***0.9.0*** - Add documentation
