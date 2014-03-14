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
mfMathPaint.Modules.Graph = function(host)
{
	this.host = host;
	
	this.tmpObjects = new Array();
	this.painting = false;
	this.mx = 0;
	this.my = 0;
	
	this.colors = ['#ff0000', '#006600', '#0000aa'];
	
	this.defaultObject = {
		'x1':0, 'y1':0, 'x2':0, 'y2':0, 'xmin':-10, 'xmax':10, 'ymin':-10, 'ymax':10,
		'graphs': new Array('x')};
	
	this.iconGraphOn = new Image();
	this.iconGraphOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIQCBwGzz560AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAIzSURBVFjD7VkxcsIwEFxlmPyEHzChtgs6KvMDPiG94DT5Az/ATUoK3HmGGX6An5FeKWIJWZaMDTYYEjXYZ51mdXfrPRkGQOEJxgQADofDqEHO5/NfoADAPz5HCXIhZwCANzzJeBqgk6Zw+4bYcNBahp8LASK62j/Pc3x/vbcDCgA7fqyB3/EjsDk/M7ZyZCw1YCOV1H0B4+/6XgpQb6nPWGrARSoxoB9Wo9FphWy6rdutCPruASCbbhGdVn+QTKF60bbMunbnZUiDvpkzv6kmbycTgIivIKZb0FrW5kH4fcWGIzqtsPMRrG8y7VmKfc8kuTmiLkAgde4Z2EYh4pfJoaPZvD4gaXY9UDuCcclkbVMFQ4zk6ih1yU4LMundEhaloEiagQthXjm20rhkMkrUUH+yQclakUnvOFYJFrJKkh1PsGcpVFGWgE6tRSbz3vQQx14bON5PmR7WPVV33JwyVbCaWjWpkLt2G7ntLaK2tHaVyja9QbBGmblIDUkgUFMhXumcSq+CIWPVedpX2es74IQQWC6X3YC6TUVISeKSdKpMpd1FeX1LcERUaxGJCHmej5dMvs0NAtQVgq4EvQTy9ds8n02rlQIgPfPOen5WuMHbvJCNC/0rgiUROm9dAj7pMz2a9SrQdMTq+gZmkBqNVVIBJYluAjk4mVzAoyBTmzNTlw8dg5Kp6czU1va6bd4/0LGQaUEzQOI+ZAq1WqOLqO/75H+NviyZuhT2IwbDk/wh9gO/bUPWsxdVXgAAAABJRU5ErkJggg==';
	
	this.iconGraphOff = new Image();
	this.iconGraphOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIQCBsL/s6QqgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAIdSURBVFjD7VjBsYIwEH38oQhPpgwL8GwDuf4mSAVLAV650oVXZujBy6aR/AMJQggBFRX17wwzukmYx8s+3pIEgMEbRAoAdV2vGuRut2uAAsBms1klyLIsAQA/eJN4G6BpjO5QqCID/ebj40qBiG5eX1UVjsfjPKAAIKUcgJdSQhWXMZdzIYRowTLzYG0DtFnvr50iaLGtF0K04Ji5Bf2yGuWThthvh/kOg6H/ACD2W/BJf6GYxurlksva3/F5fi7rjcVq8m4xNWMaYt+o15+nlAquVUVmtz0sxEXFtBUC24VFcjejPsDM+28AJIWBlNPiuLA5fn8AQOT9m84B6UJbJbucOSfQ4JtZumZ3JsXkmMyJAFdDRMiUal85vtN0a805UUw3eYTJWWJyT6yZAa/4tR035wRJYdqt7YrJvTfLcijO7r3lM53pZd1Tj82JLTPnZOBWMRfy7z3HbhdjtGut11rl3N7A1HVtmLm9iMjYb6nJy9hrqfmHwyGIJY095ZgzdXOtqOxWdruo4FrLHBENWkQiQlVV6xVT6OEeAtQ3gmsFOgXyG9q8QM66lQGQB+Y5NrsO9/A2bzRnbdXZa6gkxr63nupMmhlJpC3UfHsD85Aa1cw9UDnRXSAfLiYf8DrEtFDuOWKKfDPNzX1um/cP9MZIbJvXO8i9psiXDv80ryxLKKXCYhprtVbn9aHzyf8a/djTvFcKaLbq34HRP7J0jtcR6Uo1AAAAAElFTkSuQmCC';
	
	this.buttonGraph = new mfMathPaint.Button(42, 42, 'Graph');
	this.buttonGraph.AddGraphic('on', this.iconGraphOn);
	this.buttonGraph.AddGraphic('off', this.iconGraphOff);
	this.buttonGraph.OnClick = this.ButtonGraphClicked.bind(this);
	this.buttonGraph.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.buttonGraph.SetActiveGraphic('off');
	
	this.host.AddButton(this.buttonGraph);
	
	this.host.RegisterHandler('GRPH1', this, false);
	this.host.RegisterHandler('GRPH2', this, false);
	this.host.RegisterHandler('GRPH3', this, false);
}

mfMathPaint.Modules.Graph.prototype.ButtonGraphClicked = function()
{
	this.host.SetActiveModule(this);
	this.buttonGraph.SetActiveGraphic('on');
}

mfMathPaint.Modules.Graph.prototype.handleEvent = function(event)
{
	if (event.type == 'mousedown')
	{
		this.mx = event.pageX;
		this.my = event.pageY;
		
		this.painting = true;
	}
	else if (this.painting && (event.type == 'mousemove' || event.type == 'mouseup'))
	{
		var o = this.defaultObject;
		
		o.x1 = Math.min(this.mx, event.pageX);
		o.y1 = Math.min(this.my, event.pageY);
		o.x2 = Math.max(this.mx, event.pageX);
		o.y2 = Math.max(this.my, event.pageY);
		
		this.host.ClearTopLayer();
		
		if (event.type == 'mousemove')
		{
			this.Render(this.host.ctxTop, o, 10);
		}
		else if (event.type == 'mouseup')
		{
			this.painting = false;
			
			var id = this.host.GetNextObjectId();
			
			this.SendAndHandle('GRPH1', id, o.x1, o.y1, o.x2, o.y2, '3');
			this.SendAndHandle('GRPH2', id, o.xmin.toFixed(5) * 10000, o.xmax.toFixed(5) * 10000, o.ymin.toFixed(5) * 10000, o.ymax.toFixed(5) * 10000,'');
			this.SendAndHandle('GRPH3', id, 0, 0, 0, 0, 'x');
			this.SendAndHandle('GRPH3', id, 0, 0, 0, 0, '');
			this.SendAndHandle('GRPH3', id, 0, 0, 0, 0, '');
		}
	}
}

mfMathPaint.Modules.Graph.prototype.Clear = function()
{
	this.tmpObjects = {};
}

mfMathPaint.Modules.Graph.prototype.OnObjectDeleted = function(data)
{
}

mfMathPaint.Modules.Graph.prototype.HandleInstruction = function(instr)
{
	if (!(instr.objectId in this.tmpObjects))
	{
		this.tmpObjects[instr.objectId] = {};
	}
	
	if (instr.instrName == 'GRPH3')
	{
		if (typeof(this.tmpObjects[instr.objectId]['GRPH3']) == 'undefined')
		{
			this.tmpObjects[instr.objectId]['GRPH3'] = new Array();
		}
		
		this.tmpObjects[instr.objectId]['GRPH3'].push(instr);
	}
	else
	{
		this.tmpObjects[instr.objectId][instr.instrName] = instr;
	}
	
	var tmp = this.tmpObjects[instr.objectId];
	
	if (tmp['GRPH1'] && tmp['GRPH2'] && tmp['GRPH3'] && tmp['GRPH3'].length == parseInt(tmp['GRPH1'].text))
	{
		var g = {'x1':tmp['GRPH1'].data1, 'y1':tmp['GRPH1'].data2, 'x2':tmp['GRPH1'].data3,
					'y2':tmp['GRPH1'].data4, 'xmin':tmp['GRPH2'].data1, 'xmax':tmp['GRPH2'].data2,
					'ymin':tmp['GRPH2'].data3, 'ymax':tmp['GRPH2'].data4,
					'graphs':new Array()};
		
		g.xmin /= 10000;
		g.xmax /= 10000;
		g.ymin /= 10000;
		g.ymax /= 10000;
		
		for (var n in tmp['GRPH3'])
		{
			g.graphs.push(tmp['GRPH3'][n].text);
		}
		
		var o = new mfMathPaint.Object(g.x1, g.y1, g.x2 - g.x1, g.y2 - g.y1, 4);
		o.SetOrigin(g.x1, g.y1);
		o.SetHasPropertyEditor(true);
		
		this.Render(o.image.getContext('2d'), g, 200);
		this.host.AddObject(instr.objectId, o);
	}
}

mfMathPaint.Modules.Graph.prototype.Render = function(ctx, g, xres)
{
	xstep = (g.xmax - g.xmin) / xres;
	
	// draw vertical grid lines
	for (var i = Math.ceil(g.xmin); i < g.xmax; ++i)
	{
		var p1 = this.ToScreen(g, i, g.ymin);
		var p2 = this.ToScreen(g, i, g.ymax);
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#ccc';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// draw horizontal grid lines
	for (var i = Math.ceil(g.ymin); i < g.ymax; ++i)
	{
		var p1 = this.ToScreen(g, g.xmin, i);
		var p2 = this.ToScreen(g, g.xmax, i);
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#ccc';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// if visible, draw x-axis
	if (g.ymin < 0 && g.ymax > 0)
	{
		var p1 = this.ToScreen(g, g.xmin, 0);
		var p2 = this.ToScreen(g, g.xmax, 0);
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#000';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// if visible, draw y-axis
	if (g.xmin < 0 && g.xmax > 0)
	{
		var p1 = this.ToScreen(g, 0, g.ymin);
		var p2 = this.ToScreen(g, 0, g.ymax);
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#000';
		
		ctx.beginPath();
		ctx.moveTo(p1.x, p1.y);
		ctx.lineTo(p2.x, p2.y);
		ctx.closePath();
		ctx.stroke();
	}
	
	// draw graph(s)
	var math = mathjs();
	
	for (var key in g.graphs)
	{
		if (g.graphs[key] == '')
			continue;
		
		var eqn = 'y = ' + this.FormatExpression(g.graphs[key]);
		var scope = {'x': g.xmin, 'y':0};
		
		math.eval(eqn, scope);
		
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = this.colors[key];
		
		var oldp = {'x':scope.x, 'y':scope.y};
		var clip = {};
		
		for (scope.x = g.xmin; scope.x <= g.xmax; scope.x += xstep)
		{
			math.eval(eqn, scope);
			
			clip = this.Clip(oldp.x, oldp.y, scope.x, scope.y, g.ymin, g.ymax);
			
			if (clip !== false)
			{
				p1 = this.ToScreen(g, clip.x1, clip.y1);
				p2 = this.ToScreen(g, clip.x2, clip.y2);
				
				ctx.beginPath();
				ctx.moveTo(p1.x, p1.y);
				ctx.lineTo(p2.x, p2.y);
				ctx.stroke();
			}
			
			oldp = {'x':scope.x, 'y':scope.y};
		}
	}
	
	ctx.lineWidth = 2.5;
	ctx.lineCap = 'butt';
	ctx.strokeStyle = '#000';
	
	ctx.beginPath();
	ctx.moveTo(g.x1, g.y1);
	ctx.lineTo(g.x2, g.y1);
	ctx.lineTo(g.x2, g.y2);
	ctx.lineTo(g.x1, g.y2);
	ctx.lineTo(g.x1, g.y1);
	ctx.closePath();
	ctx.stroke();
}

mfMathPaint.Modules.Graph.prototype.Clip = function(x1, y1, x2, y2, ymin, ymax)
{
	if ((y1 < ymin && y2 < ymin) || (y1 > ymax && y2 > ymax))
	{
		return false;
	}
	else if ((y1 > ymin && y2 > ymin) && (y1 < ymax && y2 < ymax))
	{
		return {'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2};
	}
	
	var k = (y2 - y1) / (x2 - x1);
	var m = y1 - k * x1;
	
	if (y1 < ymin)
	{
		x1 = (ymin - m) / k;
		y1 = ymin;
	}
	else if (y1 > ymax)
	{
		x1 = (ymax - m) / k;
		y1 = ymax;
	}
	
	if (y2 < ymin)
	{
		x2 = (ymin - m) / k;
		y2 = ymin;
	}
	else if (y2 > ymax)
	{
		x2 = (ymax - m) / k;
		y2 = ymax;
	}
	
	return {'x1':x1, 'y1':y1, 'x2':x2, 'y2':y2};
}

mfMathPaint.Modules.Graph.prototype.FormatExpression = function(expr)
{
	var result = expr.replace(',', '.');
	var re = /[0-9]+(?=[A-Za-z\(])/g;
	var match = new Array();
	var n = 0;
	
	while (match = re.exec(expr))
	{
		result = result.substring(0, match.index + match[0].length + n) + '*' + result.substring(match.index + match[0].length + n);
		++n;
	}
	
	return result;
}

mfMathPaint.Modules.Graph.prototype.ToScreen = function(graphObj, x, y)
{
	var result = {};
	
	var left   = graphObj.x1;
	var top    = graphObj.y1;
	var width  = graphObj.x2 - graphObj.x1;
	var height = graphObj.y2 - graphObj.y1;
	var x_min  = graphObj.xmin;
	var x_max  = graphObj.xmax;
	var y_min  = graphObj.ymin;
	var y_max  = graphObj.ymax;
	
	result.x = left + width * ((x - x_min) / (x_max - x_min));
	result.y = top + height * ((y_max - y) / (y_max - y_min));
	
	return result;
}

mfMathPaint.Modules.Graph.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	for (var key in data)
	{
		var d = data[key];
		
		if (d.instrName == 'GRPH1')
		{
			d.data1 += dx;
			d.data2 += dy;
			d.data3 += dx;
			d.data4 += dy;
		}
		
		this.host.SendInstruction(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
	}
	
	oldObject.x += dx;
	oldObject.y += dy;
	
	this.host.AddObject(id, oldObject);
}

mfMathPaint.Modules.Graph.prototype.CommitResize = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	for (var key in data)
	{
		var d = data[key];
		
		if (d.instrName == 'GRPH1')
		{
			d.data3 += dx;
			d.data4 += dy;
		}
		
		this.SendAndHandle(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
	}
}

mfMathPaint.Modules.Graph.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	var tmp = {};
	var n = 0;
	
	for (var key in data)
	{
		if (data[key].instrName == 'GRPH2')
		{
			editor.AddProperty('XMin', data[key].data1 / 10000);
			editor.AddProperty('XMax', data[key].data2 / 10000);
			editor.AddProperty('YMin', data[key].data3 / 10000);
			editor.AddProperty('YMax', data[key].data4 / 10000);
		}
		if (data[key].instrName == 'GRPH3')
		{
			editor.AddProperty('Y' + ++n + '=', data[key].text);
		}
	}
	
	editor.AddProperty('objectId', data[0].objectId, true);
	editor.AddProperty('numFunc', n, true);
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.Graph.prototype.ApplyProperties = function(p)
{
	var error = false;
	
	for (var n = 1; n <= parseInt(p.numFunc); ++n)
	{
		if (p['Y' + n + '='] == '')
			continue;
		
		var eqn = 'y = ' + this.FormatExpression(p['Y' + n + '=']);
		var scope = {'x':0, 'y':0};
		var math = mathjs();
		
		try
		{
			math.eval(eqn, scope);
		}
		catch (err)
		{
			alert('Syntax error: ' + eqn);
			error = true;
			break;
		}
	}
	
	if (!error)
	{
		var id = this.host.GetNextObjectId();
		var data = this.host.GetObjectInstructions(p.objectId);
		
		this.host.DeleteObject(p.objectId, true);
		
		var n = 0;
		
		for (var key in data)
		{
			var d = data[key];
			
			if (d.instrName == 'GRPH2')
			{
				d.data1 = parseFloat(p['XMin']).toFixed(5) * 10000;
				d.data2 = parseFloat(p['XMax']).toFixed(5) * 10000;
				d.data3 = parseFloat(p['YMin']).toFixed(5) * 10000;
				d.data4 = parseFloat(p['YMax']).toFixed(5) * 10000;
			}
			else if (d.instrName == 'GRPH3')
			{
				d.text = p['Y' + ++n + '='];
			}
			
			this.SendAndHandle(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
		}
		
		this.host.RepaintBottom();
	}
}

mfMathPaint.Modules.Graph.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
