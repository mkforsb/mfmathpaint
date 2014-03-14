/**
 * This file is part of mfMathPaint
 * Copyright (C) 2014  Mikael Forsberg <mikael@liveforspeed.se>
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
mfMathPaint.Modules.CoordinateSystem = function(host)
{
	this.host = host;
	this.eventHandler = false;
	
	this.tmpObjects = {};
	this.objectCache = {};
	
	this.painting = false;
	this.mx = 0;
	this.my = 0;
	
	this.defaultObject = {
		'x1':0, 'y1':0, 'x2':0, 'y2':0, 'resolution':1, 'xmin':-10, 'xmax':10,
		'ymin':-10, 'ymax':10};
	
	this.iconCoordSysOn = new Image();
	this.iconCoordSysOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIQCBIbMrs7hwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFVSURBVFjD7Zm9boMwFIU/KtQX6KtEZSZDNibyMPgJHDWvUi8dO9SbJaS+SrbudIiEopZgO/zZCXfD4opzr8/xPTIJ0BBBpAB1XQcNMsuyM1CA6vUtSJC7wwaAJyKJaICmfe2+JYQQSClvzjfG8PPx7AYU4LP6/gfetqYT1YLNm9Ir19ag0bZeJ6oFlzdlCzo4jl52sOt5Eo5OHV+JAhSVgK1jQant/PJd0yiH95S3cEcV01lJ9txKdH+nD/QiW79tyu4i7+HAj3syTS8m/wm4iJgWnUwPwVGXcRsEUBdvkLpWqVEgsK4NyRVCUBSFH9C/psJVEJcuytciSikxxoTNUZvbCoajo9g8/fKOBjhCftqHO5l0z6Ec1mQ6Xrdlc00mp63PT3tvW/aw7mm1eavNWzm6immgmHZyAwfmEdM1qxVcR7vuJ1eO3q2YhlyHzxEJkfwQ+wX6iNogdSqsHAAAAABJRU5ErkJggg==';
	
	this.iconCoordSysOff = new Image();
	this.iconCoordSysOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIQCBE3K04EpwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFVSURBVFjD7VjBjYMwEJycKIIXriEvqqAB+jiJrWAj5UsNLsWSX6lhaYR7XA4ldxBsQsDOeSU/sECMlhnPsAcAPSKoDACstUGDLMvyGygA5HkeJEitNQDgA5FUNECzR+1eUkQEZl78vDEGbdu6AQWAuq7/gJ/bU0oNYEXE69m5Bq326ZVSAzgRGUAHx9HbDo5dRymmQik0RCg8up7NnV+v2GsWCHdVMf0IafY+otH3bCImn+pEcGJG58Hj5EybONOrxbTEAfcR057O9C846mK3QQB1zQa9tbYXkWExc3/9l9p8VVU1iiVzDRmugrhNUb4RkZlhjAmbo3NpKxiOriImdSxA5wbqWITuTM3koRyUM9EZk7EsKGeSSwf+PEEuXUpPKealmJc4moDe1+Ea8+4Guc9M856t39M8rTWIaFxMU1EruONpbD6ZOPq2zrSngJxVH0NHvwD4Nib4euCsjgAAAABJRU5ErkJggg==';
	
	this.iconPointManipOn = new Image();
	this.iconPointManipOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIQCBYZuNmfrwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAATJSURBVFjD7ZlPaFxVFMZ/5743f960CW0DKkW0CEURhdJJk42oDU3aTUFMoYvSlXZlBUVoM90qTJpAINBu7EYQdeOIuLKtOFLKSG1TYlVoLAi1aFAqxiTz5t9797p4k2kmM8nMJJPQiHcxi/vm3fnu+c53znfvCGDYBMMGuHbt2kMNsre3NwAKMNQz8lCCHBjuBkCxScamAWqvFO7VjEQiQTKZXPX7mUyG+S/CzQEFuDR0owb8wpwxQaHoT8a5nJgAQERIS6oCdr8ZrPtuo7m2UW+MAQ3GM2itMZ7B+Ia0pHhZvwrAfjNYAb2u1DcGqdElQ6lUQrs+Ygsv5V8B/eC7iyO64UAxYHyDzmv8rEcul6N0v4CKWqiYhXIebEhEll3ma0kBKYYS0NfkhuxG9WtxNPuH43ieRz6fx3VdRsdHOTFzglAohOM4OI7DFT6nPxlHRKrAVq+Xalm4TYupPxnn0qkb6KxP6X6B/L0cjMOFCxd49pMewo9GiOx04D24+PZ1VFiBCkS2VDhDifq/sxLo1qnXAfXeTLGK5qff34vxgmrgz3uw1UaFFUbVWok+M1hX9W3NUbQJxOT6VWkhIuw+vweA0v1C8GABrDEbLCbAGDAadFHX5PBCThbu5R482GpjjGkosPaJCcOBkb0UCgVmZmaYnp7mNhN1wT55fgddXV1s27aNWCyGH/GbEFgbxfTVqZt4syUKd13mJmcWi7c2Dc7tIbZ7K5EnHAY+6uXKmR9XFFh7xbQwpHFjqOSsAtd10TkfUSAhhVmFV18392SM4c4bk+TvumSzWfx5D13UGF0Lspl2u642zxjD1Os3cV0Xf97DlIIWvDSgzXiDZalf+mKaFJxZHVgRgQ+r57/hM0jUWsTDhw+3BnSpqehPxrn4zvVATL+6zE/+w+3XJlZO5bLCjx07xp3En4Qfi2B1hBBbODiyr0pMaUmRTCbJZDLtoV6k/KFoCPKRo4/z1PBzhEIhJKIQWwVClFr2Grktu2W1iyCWoCJWU5R3dG/HsizEKm9OGrO3aqDprk9JGwOjHi/8MoiKKKwOu4bixe5/YeiCj+d5GE/XFVJbO1N6UUgPjMfJ5XLMzs7yAxlEhEOHDlEoFMhms4hIBexCVHuOPk/vuWfo7OwkEomgVFD429+ZRst5aRTpoUn8rI/3d5GT1kmuHrnF77k5/DmPwm95+K52rXw+z9Wjt4juimFvD6PCioGR7sp5q22daf9fRxgY7ubi6esYX1COhS1hOjo6cHbF0EWNP+ehoqqSCkujuuetFwMbqE17qV+23JQ1ZCmLaDSK3RXBeBorZq+Yf2LLmtqL3Xp5KoNVgm3bQRS1QpQQ8oLz+NjYWJXAjh8/zu3O6cCUWAJCy5avaZtXd07BwdF9GBMcnYvFIt/yJVNTU5VCHw6H2bJlC30f78RxnGBzKqin62LzlrNllxMTlWO0Lmp4F74/fZeeN/v5Wf+Biij6PohzdegnVNQKUkDg4Nl9G2Dz6qSDUQYJBXSGdoQxneUTgCVEo9EqkKtx+m0BulRoKmaBLiunnMtrAdlWoIs7lNgCRiptV0QQJWtae21iqjM3kOyGs7Ueodn1WgK6nNV66O5H691P/n/j/J+9Gl/LdfhGDGGT/CH2L8cFIerG9HcjAAAAAElFTkSuQmCC';
	
	this.iconPointManipOff = new Image();
	this.iconPointManipOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIQCBU1oSygjwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAASASURBVFjD7ZjNSxtbGIefMx+ZjNGa0halqEG460IXF1fitgu7s9gkCv4VNRHcNIUsCgWpO5eSGBHzB7hxJ+jmrlpoV6a01ZVfOJl8TDJ3IXMwH5qYxlYv92ySHGZOfvO+5/eeZ14BuNyDoQHs7u7eaZFjY2MXQgEGBwfvpMh0Og2Awj0Z90aodl24OxnxeJxkMtnx/Ts7OywvL7cnFCASiTSI9+Zc96JQpFIpotEoAEIIQqGQFJvL5Zre22qua6l3XZdqtYrjOPKzUqkQCoXY398HIJfLSdG3mvp2RDqOQ7lcxrZtNE3j69evVKtVee3liP4RoZVKhWKxiG3b2LbN8fExhmFgmiaGYcjrhBBXrjMSChG72CN8a/OBtFb167LIdDqN4zgUCgXy+TxLS0ucnJyg6zqmaWKapty7QogasZfXi3Vg3LbNlEqleP36Nfl8nuPjY37+/MnS0hIrKyt8/PiRx48fMzAwwLt375iamkLXdRRFQQjRaJx4vOn/XCf6xql3XZdiscjZ2VlNmpPJJJVKBQDLsggEAlJs/fiWyzV1/a2YybbtmnkhBIlEAoCjoyMAKdYrZ7/NTJfFlsvlhnlvTx4cHMj5QCAgM3GdwbpmJoBMJkOxWOTk5KRGTL3YjY0NHj16RDAYpKenB8MwWhqs62Y6Pz/nx48ffPr0ic3NzSvFvn37ltHRUZ4+fcr29jazs7PXG6ybZrrJ9vD2rKIo5PN5CoUCQgh0Xb9b9OS6LouLi3z//h3LsrAsi3K5XHN6eaOd4/ZWMc91Xebn58nn81iWJfmgvgq0wwZXpr7ZjQsLCx1vg9XV1aZIWP/75cuXNxNaDxWpVIpXr15JM33+/Jk3b95cK9JzeDQaZW5ujidPnhAIBNA0jUwmU2OmUChEMplkZ2enO6n3SkyzE6f+usnJSWKxGLqu4/P5UFW1oUR5IlvRltaJSFVV8fl8baX82bNnqKqKoiiyNLXKXscRDT0fYeF9jL/+HkEIgc/nIxAINDxAMxGlUknCdTMjdflk8sBMkM1msW1bQokQghcvXlAsFrEsCyGEFONFdXp6mmw2y4MHDzAMQ0a36ydT/D0gBLgKkUgE27Y5PT1FVVXGx8cpFApYlsXh4SF7e3sNaxUKBSYmJhgeHqa/vx9d18lkMvJ9q2snU+6fb6TTacLhMJWKit/vRwhBX18fQ0NDlMtlzs/PJeE3i2o4HJZ19NbpyTOS993v9/Pw4UMcx5F0f+UfaVrLStFVzPPEKoqCpmkYhiFhw3EcAD58+FBjrNnZWXp7e2ug5KbIdyPMq59TFIX19XXJqKVSCYAvX77IQu9ViO3tbUzTlJH1CKrrmHcVlkWj0RqYTiQSzMzMMDU1RbVaxefzsbW1RTQaxTAMNE1DCMHa2trvxzzvpNK0i+WCwaB8f1IUBb/fXyOyE9LvGo9eNpppmtLd3gP8isiug7MnQtM0WZ7aZYOWawPu7u5uTSP3V7p5vzrqu3npdJp4PN48oleh1p3rjzbrT/7fcf7Ptsb/pIHadv19iOi/3bhH2UKfRBkAAAAASUVORK5CYII=';
	
	this.buttonCoordSys = new mfMathPaint.Button(42, 42, 'Coordinate System');
	this.buttonCoordSys.AddGraphic('on', this.iconCoordSysOn);
	this.buttonCoordSys.AddGraphic('off', this.iconCoordSysOff);
	this.buttonCoordSys.OnClick = this.ButtonCoordSysClicked.bind(this);
	this.buttonCoordSys.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonCoordSys.SetActiveGraphic('off');	
	
	this.buttonPointManip = new mfMathPaint.Button(42, 42, 'Coordinate System - Point');
	this.buttonPointManip.AddGraphic('on', this.iconPointManipOn);
	this.buttonPointManip.AddGraphic('off', this.iconPointManipOff);
	this.buttonPointManip.OnClick = this.ButtonPointManipClicked.bind(this);
	this.buttonPointManip.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonPointManip.SetActiveGraphic('off');
	
	this.host.AddButton(this.buttonCoordSys);
	this.host.AddButton(this.buttonPointManip);
	
	this.host.RegisterHandler('COOR1', this);
	this.host.RegisterHandler('COOR2', this);
	this.host.RegisterHandler('COOR3', this);
}

mfMathPaint.Modules.CoordinateSystem.prototype.ButtonCoordSysClicked = function()
{
	this.host.SetActiveModule(this);
	this.buttonCoordSys.SetActiveGraphic('on');
	this.eventHandler = this.DrawEvent;
}

mfMathPaint.Modules.CoordinateSystem.prototype.ButtonPointManipClicked = function()
{
	this.host.SetActiveModule(this);
	this.buttonPointManip.SetActiveGraphic('on');
	this.eventHandler = this.PointEvent;
}

mfMathPaint.Modules.CoordinateSystem.prototype.handleEvent = function(event)
{
	this.eventHandler(event);
}

mfMathPaint.Modules.CoordinateSystem.prototype.DrawEvent = function(event)
{
	if (event.type == 'mousedown')
	{
		this.painting = true;
		
		this.mx = this.defaultObject.x1 = event.pageX;
		this.my = this.defaultObject.y1 = event.pageY;
	}
	else if (this.painting && event.type == 'mousemove')
	{
		this.host.ClearTopLayer();
		
		var ctx = this.host.ctxTop;
		
		this.defaultObject.x2 = event.pageX;
		this.defaultObject.y2 = event.pageY;
		
		this.Render(ctx, this.defaultObject);
	}
	else if (this.painting && event.type == 'mouseup')
	{
		this.host.ClearTopLayer();
		this.painting = false;
		
		var d = this.defaultObject;
		
		d.x1 = Math.min(this.mx, event.pageX);
		d.y1 = Math.min(this.my, event.pageY);
		d.x2 = Math.max(this.mx, event.pageX);
		d.y2 = Math.max(this.my, event.pageY);
		
		var id = this.host.GetNextObjectId();
		
		this.SendAndHandle('COOR1', id, d.x1, d.y1, d.x2, d.y2, d.resolution);
		this.SendAndHandle('COOR2', id, d.xmin.toFixed(5) * 10000, d.xmax.toFixed(5) * 10000, d.ymin.toFixed(5) * 10000, d.ymax.toFixed(5) * 10000, '');
	}
}

mfMathPaint.Modules.CoordinateSystem.prototype.GetPointedObject = function(x, y)
{
	for (var key in this.objectCache)
	{
		var o = this.objectCache[key];
		
		if (x >= o.x1 && x <= o.x2 && y >= o.y1 && y <= o.y2)
		{
			return key;
		}
	}
	
	return -1;
}

mfMathPaint.Modules.CoordinateSystem.prototype.PointEvent = function(event)
{
	var x = event.pageX;
	var y = event.pageY;
	
	var objectId = this.GetPointedObject(x, y);
	var o = this.objectCache[objectId];
	
	if (o)
	{
		var res = o.resolution;
		var digits = Math.ceil(-Math.log10(res));
		
		if (event.type == 'mousemove')
		{
			this.host.ClearTopLayer();
			
			var ctx = this.host.ctxTop;
			var point = this.Conv(o, x, y, 'internal');
			
			for (var n in o.points)
			{
				var pt = o.points[n];
				var pts = this.Conv(o, pt.x, pt.y, 'screen');
				
				var dx = Math.sqrt(Math.pow(x - pts.x, 2) + Math.pow(y - pts.y, 2));
				
				if (dx < 10)
				{
					ctx.lineWidth = 3.0;
					ctx.strokeStyle = '#f00';
					ctx.beginPath();
					ctx.arc(pts.x, pts.y, 5, 0, 7, false);
					ctx.stroke();
				}
			}
			
			ctx.font = '12px sans-serif';
			ctx.fillText('x: ' + (Math.round(point.x / res) * res).toFixed(digits) + ', y: ' + (Math.round(point.y / res) * res).toFixed(digits), o.x1, o.y1 - 10);
		}
		else if (event.type == 'mousedown')
		{
			var adding = true;
			
			for (var n in o.points)
			{
				var pt = o.points[n];
				var pts = this.Conv(o, pt.x, pt.y, 'screen');
				
				var dx = Math.sqrt(Math.pow(x - pts.x, 2) + Math.pow(y - pts.y, 2));
				
				if (dx < 10)
				{
					adding = false;
					
					var data = this.host.GetObjectInstructions(objectId);
					
					if (data.length > 0)
					{
						var id = this.host.GetNextObjectId();
						
						this.host.DeleteObject(objectId, true);
						this.host.Repaint();
						
						for (var k in data)
						{
							if (data[k].instrName == 'COOR3' && data[k].data1 == pt.x * 10000 && data[k].data2 == pt.y * 10000)
								continue;
							
							this.SendAndHandle(data[k].instrName, id, data[k].data1, data[k].data2, data[k].data3, data[k].data4, data[k].text);
						}
					}
				}
			}
			
			if (adding)
			{
				var point = this.Conv(o, x, y, 'internal');
				this.SendAndHandle('COOR3', objectId, (Math.round(point.x / res) * res).toFixed(digits) * 10000, (Math.round(point.y / res) * res).toFixed(digits) * 10000, 0, 0, '');
			}
		}
	}
}

mfMathPaint.Modules.CoordinateSystem.prototype.HandleInstruction = function(instr)
{
	if (instr.instrName == 'COOR1' || instr.instrName == 'COOR2')
	{
		if (!(instr.objectId in this.tmpObjects))
		{
			this.tmpObjects[instr.objectId] = {};
		}
		
		var o = this.tmpObjects[instr.objectId];
		
		o[instr.instrName] = instr;
		
		if (o['COOR1'] && o['COOR2'])
		{
			var c1 = o['COOR1'];
			var c2 = o['COOR2'];
			
			this.objectCache[c1.objectId] = {'x1':c1.data1, 'y1':c1.data2, 'x2':c1.data3, 'y2':c1.data4,
				'resolution':parseFloat(c1.text), 'xmin':c2.data1 / 10000, 'xmax':c2.data2 / 10000, 'ymin':c2.data3 / 10000,
				'ymax':c2.data4 / 10000, 'points':new Array()};
			
			var o = new mfMathPaint.Object(c1.data1, c1.data2, c1.data3 - c1.data1, c1.data4 - c1.data2, 24);
			o.SetOrigin(c1.data1, c1.data2);
			o.SetHasPropertyEditor(true);
			
			this.Render(o.image.getContext('2d'), this.objectCache[c1.objectId]);
			this.host.AddObject(c1.objectId, o);
			
			delete this.tmpObjects[c1.objectId];
		}
	}
	else if (instr.instrName == 'COOR3' && this.objectCache[instr.objectId])
	{
		var point = this.Conv(this.objectCache[instr.objectId], instr.data1 / 10000, instr.data2 / 10000, 'screen');
		var ctx = this.host.GetObject(instr.objectId).image.getContext('2d');
		
		ctx.lineWidth = 2.0;
		ctx.strokeStyle = '#00f';
		ctx.beginPath();
		ctx.arc(point.x, point.y, 4, 0, 7, false);
		ctx.closePath();
		ctx.stroke();
		
		this.objectCache[instr.objectId].points.push({'x':instr.data1 / 10000, 'y':instr.data2 / 10000});
		
		this.RenderTextbox(ctx, point.x - 20, point.y - 12, '(' + (instr.data1 / 10000) + ', ' + (instr.data2 / 10000) + ')');
		this.host.RepaintBottom();
	}
}

mfMathPaint.Modules.CoordinateSystem.prototype.Clear = function()
{
	this.objectCache = {};
}

mfMathPaint.Modules.CoordinateSystem.prototype.OnObjectDeleted = function(data)
{
	delete this.objectCache[data[0].objectId];
	this.host.ClearTopLayer();
}

mfMathPaint.Modules.CoordinateSystem.prototype.Render = function(ctx, obj)
{
	// draw vertical grid lines
	for (var i = Math.ceil(obj.xmin); i < obj.xmax; ++i)
	{
		var p1 = this.Conv(obj, i, obj.ymin, 'screen');
		var p2 = this.Conv(obj, i, obj.ymax, 'screen');
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#ccc';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// draw horizontal grid lines
	for (var i = Math.ceil(obj.ymin); i < obj.ymax; ++i)
	{
		var p1 = this.Conv(obj, obj.xmin, i, 'screen');
		var p2 = this.Conv(obj, obj.xmax, i, 'screen');
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#ccc';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// if visible, draw x-axis
	if (obj.ymin < 0 && obj.ymax > 0)
	{
		var p1 = this.Conv(obj, obj.xmin, 0, 'screen');
		var p2 = this.Conv(obj, obj.xmax, 0, 'screen');
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#000';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// if visible, draw y-axis
	if (obj.xmin < 0 && obj.xmax > 0)
	{
		var p1 = this.Conv(obj, 0, obj.ymin, 'screen');
		var p2 = this.Conv(obj, 0, obj.ymax, 'screen');
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#000';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.strokeStyle = '#000';
	
	ctx.beginPath();
	ctx.moveTo(obj.x1, obj.y1);
	ctx.lineTo(obj.x2, obj.y1);
	ctx.lineTo(obj.x2, obj.y2);
	ctx.lineTo(obj.x1, obj.y2);
	ctx.lineTo(obj.x1, obj.y1);
	ctx.closePath();
	ctx.stroke();
}

mfMathPaint.Modules.CoordinateSystem.prototype.RenderTextbox = function(ctx, x, y, text)
{
	ctx.font = '10pt "Verdana", sans-serif';
	
	ctx.globalAlpha = 0.6;
	ctx.lineWidth = 1.0;
	ctx.fillStyle = '#fff';
	ctx.strokeStyle = '#000';
	ctx.fillRect(x - 4, y - 14, ctx.measureText(text).width + 8, 18);
	ctx.strokeRect(x - 4, y - 14, ctx.measureText(text).width + 8, 18);
	
	ctx.globalAlpha = 1.0;
	
	ctx.fillStyle = '#000';
	ctx.fillText(text, x, y);
}

mfMathPaint.Modules.CoordinateSystem.prototype.Conv = function(obj, x, y, target)
{
	var result = {};
	
	var left   = obj.x1;
	var top    = obj.y1;
	var width  = obj.x2 - obj.x1;
	var height = obj.y2 - obj.y1;
	var x_min  = obj.xmin;
	var x_max  = obj.xmax;
	var y_min  = obj.ymin;
	var y_max  = obj.ymax;
	
	if (target == 'screen')
	{
		result.x = left + width * ((x - x_min) / (x_max - x_min));
		result.y = top + height * ((y_max - y) / (y_max - y_min));
	}
	else if (target == 'internal')
	{
		result.x = x_min + ((x - left) / width * (x_max - x_min));
		result.y = y_max - (y - top) / height * (y_max - y_min);
	}
	
	return result;
}

mfMathPaint.Modules.CoordinateSystem.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	for (var key in data)
	{
		var d = data[key];
		
		if (d.instrName == 'COOR1')
		{
			d.data1 += dx;
			d.data2 += dy;
			d.data3 += dx;
			d.data4 += dy;
		}
		
		this.SendAndHandle(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
	}
}

mfMathPaint.Modules.CoordinateSystem.prototype.CommitResize = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	for (var key in data)
	{
		var d = data[key];
		
		if (d.instrName == 'COOR1')
		{
			d.data3 += dx;
			d.data4 += dy;
		}
		
		this.SendAndHandle(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
	}
}

mfMathPaint.Modules.CoordinateSystem.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	for (var n in data)
	{
		if (data[n].instrName == 'COOR1')
		{
			editor.AddProperty('Resolution', data[n].text);
		}
		else if (data[n].instrName == 'COOR2')
		{
			editor.AddProperty('XMin', data[n].data1 / 10000);
			editor.AddProperty('XMax', data[n].data2 / 10000);
			editor.AddProperty('YMin', data[n].data3 / 10000);
			editor.AddProperty('YMax', data[n].data4 / 10000);
		}
	}
	
	editor.AddProperty('objectId', data[0].objectId, true);
	
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.CoordinateSystem.prototype.ApplyProperties = function(p)
{
	var data = this.host.GetObjectInstructions(p.objectId);
	this.host.DeleteObject(p.objectId, true);
	
	var id = this.host.GetNextObjectId();
	
	for (var n in data)
	{
		if (data[n].instrName == 'COOR1')
		{
			data[n].text = parseFloat(p.Resolution);
		}
		else if (data[n].instrName == 'COOR2')
		{
			data[n].data1 = parseFloat(p.XMin).toFixed(5) * 10000;
			data[n].data2 = parseFloat(p.XMax).toFixed(5) * 10000;
			data[n].data3 = parseFloat(p.YMin).toFixed(5) * 10000;
			data[n].data4 = parseFloat(p.YMax).toFixed(5) * 10000;
		}
		
		this.SendAndHandle(data[n].instrName, id, data[n].data1, data[n].data2, data[n].data3, data[n].data4, data[n].text);
	}
}

mfMathPaint.Modules.CoordinateSystem.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
