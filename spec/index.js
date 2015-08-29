'use strict';
import Describe from '../components/Describe';
import Assert from '../components/Assert';
import It from '../components/It';
window.Describe = Describe;
window.Assert = Assert;
window.It = It;
/* eslint-disable quotes */
let specsContext = require.context(".", true, /_spec$/);
specsContext.keys().forEach(specsContext);
