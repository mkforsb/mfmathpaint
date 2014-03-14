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
mfMathPaint.Modules.Polygon = function(host)
{
	this.host = host;
	
	this.painting = false;
	this.moving = false;
	this.mx = 0;
	this.my = 0;
	this.tmpPoly = new Array();
	this.selectedPoint = false;
	
	this.tmpObjects = {};
	this.objectCache = {};
	
	this.iconPolygonOn = new Image();
	this.iconPolygonOff = new Image();
	
	this.iconPolygonOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMJCwgfl8yKuQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEQSURBVFjD5Zm9EYMwDEY/6zxSLtQ0WYBlMkIuuzADNVORIsclBbHlH8kyUUlhnp8kn8AOwIYOwgPAuq6mIYdheIMCwP36NAl5e1w+RmvH4ubD5+M2laW+FIALtLg5G9ZrGanSTFpQ4zZlW6XQghKRuzahk6DaO5ey2sxoKixJ1JMEbP81as2qCaMcWJLqUvXUW7FqqplCsCRxlJw69TEhJHGUlA7dR9PVeQ58TauhWfW8RqWsxib/box6id3nfNnG1vMtIL/LhruW10wf116VHxCpL8mxVwSaAlkLLhmUAykBlwQagpSGY4P+gixpCpUa1bKXBLqDtbDHBrUCFwW1BPgfY17T1O+3D1bDoZMLsRfxiZLZ1bpf7AAAAABJRU5ErkJggg==';
	this.iconPolygonOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMJCwgJYxg/6AAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEISURBVFjD5Zm9EcMgDEY/6xiCjjG8Mbt4DCZJipwvKRwQPxLCVukCP54kTjYbgBcWCAcAx3GYhtz3/QMKAN57k5Axxq/R0RFCuHyeUupLfS8AFyiE0AzrtIwMaSYtqJRSs1XKLSgRrWsTFgkavXMpq9OM1sKSRD1JwK5fo9asmjDKgSWpLlVPvRWrppopB0sSR8mtU18SQhJHSe/QfTVd3efA17Sam1Xva1TKamnyX8aok9h9y5dtaT03A/K3bLhrOc30ce0N+QFR+5IWe12gNZCj4KpBOZAScFWgOUhpODboP8ieplCpUS17VaAn2Ax7bFArcEVQS4DPGPOmpv68fbAaGxa5EHsDa5qV6bABK1UAAAAASUVORK5CYII=';
	
	this.btPolygon = new mfMathPaint.Button(42, 42, 'Polygon');
	this.btPolygon.AddGraphic('polygon-on', this.iconPolygonOn);
	this.btPolygon.AddGraphic('polygon-off', this.iconPolygonOff);
	this.btPolygon.OnClick = this.ButtonPolygonClicked.bind(this);
	this.btPolygon.OnRelease = function() { this.SetActiveGraphic('polygon-off'); };
	this.btPolygon.SetActiveGraphic('polygon-off');
	
	this.host.AddButton(this.btPolygon);
	this.host.RegisterHandler('POLY1', this);
	this.host.RegisterHandler('POLY2', this);
}

mfMathPaint.Modules.Polygon.prototype.ButtonPolygonClicked = function()
{
	this.btPolygon.SetActiveGraphic('polygon-on');
	this.host.SetActiveModule(this);
}

mfMathPaint.Modules.Polygon.prototype.handleEvent = function(event)
{
	if (!this.painting && event.type == 'mousedown')
	{
		var x = event.pageX;
		var y = event.pageY;
		var doneAlready = false;
		
		for (var n in this.objectCache)
		{
			for (var k in this.objectCache[n].points)
			{
				var p = this.objectCache[n].points[k];
				var d = Math.sqrt(Math.pow(p.x - x, 2) + Math.pow(p.y - y, 2));
				
				if (d < 12)
				{
					if (this.host.GetObjectInstructions(n).length > 0)
					{
						if (event.shiftKey)
						{
							this.DeletePoint(this.objectCache[n], k);
						}
						else
						{
							
							this.selectedPoint = {'object':this.objectCache[n], 'point':k};
							
							this.mx = event.pageX;
							this.my = event.pageY;
						}
					}
					
					doneAlready = true;
					break;
				}
			}
		}
		
		if (!doneAlready && event.shiftKey)
		{
			for (var n in this.objectCache)
			{
				if (this.host.GetObjectInstructions(n).length < 1)
					continue;
				
				var p = this.objectCache[n].points;
				
				for (var i = 0; i < this.objectCache[n].points.length; ++i)
				{
					var i2 = (typeof(p[i + 1]) == 'undefined') ? 0 : i + 1;
					var k = (p[i2].y - p[i].y)/(p[i2].x - p[i].x);
					var m = p[i].y - k * p[i].x;
					
					if (event.pageX > Math.min(p[i].x, p[i2].x) && event.pageX < Math.max(p[i].x, p[i2].x) && Math.abs(k * event.pageX + m - event.pageY) < 10)
					{
						this.InsertPoint(this.objectCache[n], i, event.pageX, event.pageY);
						doneAlready = true;
						break;
					}
				}
			}
			
		}
		
		if (!doneAlready && !event.shiftKey)
		{
			this.painting = true;
			this.tmpPoly.push({'x':x, 'y':y});
		}
	}
	else if (!this.moving && this.selectedPoint && event.type == 'mousemove')
	{
		this.host.DeleteObject(this.selectedPoint.object.instr[0].objectId, true);
		this.host.RepaintBottom();
		
		this.moving = true;
		this.handleEvent(event);
	}
	else if (this.moving && (event.type == 'mousemove' || event.type == 'mouseup'))
	{
		var which = Math.floor(this.selectedPoint.point / 2);
		
		if ((this.selectedPoint.point % 2) == 0)
		{
			this.selectedPoint.object.instr[which].data1 += event.pageX - this.mx;
			this.selectedPoint.object.instr[which].data2 += event.pageY - this.my;
		}
		else
		{
			this.selectedPoint.object.instr[which].data3 += event.pageX - this.mx;
			this.selectedPoint.object.instr[which].data4 += event.pageY - this.my;
		}
		
		this.mx = event.pageX;
		this.my = event.pageY;
		
		this.host.ClearTopLayer();
		
		if (event.type == 'mousemove')
		{
			this.RenderPolygon(this.host.ctxTop, this.GetPoints(this.selectedPoint.object.instr));
		}
		else if (event.type == 'mouseup')
		{
			this.moving = false;
			
			var id = this.host.GetNextObjectId();
			this.SendPolygon(id, this.GetPoints(this.selectedPoint.object.instr));
			
			this.selectedPoint = false;
		}
	}
	else if (this.painting && event.type == 'mousemove')
	{
		this.host.ClearTopLayer();
		
		this.tmpPoly.push({'x':event.pageX, 'y':event.pageY});
		this.RenderPolygon(this.host.ctxTop, this.tmpPoly);
		
		this.tmpPoly.pop();
	}
	else if (this.painting && event.type == 'mousedown')
	{
		var d = Math.sqrt(Math.pow(event.pageX - this.tmpPoly[0].x, 2) + Math.pow(event.pageY - this.tmpPoly[0].y, 2));
		
		if (d < 10)
		{
			var id = this.host.GetNextObjectId();
			
			this.SendPolygon(id, this.tmpPoly);
			
			this.host.ClearTopLayer();
			this.painting = false;
			this.tmpPoly = new Array();
		}
		else
		{
			this.tmpPoly.push({'x':event.pageX, 'y':event.pageY});
		}
	}
}

mfMathPaint.Modules.Polygon.prototype.DeletePoint = function(obj, nth)
{
	var id = this.host.GetNextObjectId();
	var newPoints = new Array();
	
	this.host.DeleteObject(obj.instr[0].objectId, true);
	this.host.RepaintBottom();
	
	for (var n in obj.points)
	{
		if (n == nth)
			continue;
		
		newPoints.push(obj.points[n]);
	}
	
	this.SendPolygon(id, newPoints);
}

mfMathPaint.Modules.Polygon.prototype.InsertPoint = function(obj, nth, x, y)
{
	var id = this.host.GetNextObjectId();
	var newPoints = new Array();
	
	this.host.DeleteObject(obj.instr[0].objectId, true);
	this.host.RepaintBottom();
	
	for (var n in obj.points)
	{
		newPoints.push(obj.points[n]);
		
		if (n == nth)
		{
			newPoints.push({'x':x, 'y':y});
		}
	}
	
	this.SendPolygon(id, newPoints);
}

mfMathPaint.Modules.Polygon.prototype.SendPolygon = function(id, points)
{
	for (var n = 0; n < points.length; ++n)
	{
		if (n + 1 < points.length)
		{
			var p1 = points[n];
			var p2 = points[++n];
			
			this.SendAndHandle('POLY1', id, p1.x, p1.y, p2.x, p2.y, Math.ceil(points.length / 2));
		}
		else
		{
			var p1 = points[n];
			this.SendAndHandle('POLY2', id, p1.x, p1.y, 0, 0, Math.ceil(points.length / 2));
		}
	}
}

mfMathPaint.Modules.Polygon.prototype.HandleInstruction = function(instr)
{
	if (!(instr.objectId in this.tmpObjects))
	{
		this.tmpObjects[instr.objectId] = new Array();
	}
	
	this.tmpObjects[instr.objectId].push(instr);
	
	if (parseInt(this.tmpObjects[instr.objectId][0].text) == this.tmpObjects[instr.objectId].length)
	{
		this.objectCache[instr.objectId] = {'instr':new Array(), 'points':new Array()};
		
		for (var n in this.tmpObjects[instr.objectId])
		{
			this.objectCache[instr.objectId].instr.push(this.tmpObjects[instr.objectId][n]);
		}
		
		var points = this.GetPoints(this.tmpObjects[instr.objectId]);
		
		var xmin = Number.MAX_VALUE;
		var xmax = Number.MIN_VALUE;
		var ymin = Number.MAX_VALUE;
		var ymax = Number.MIN_VALUE;
		
		this.objectCache[instr.objectId].points = points;
		
		for (var n in points)
		{
			if (points[n].x < xmin)
			{
				xmin = points[n].x;
			}
			
			if (points[n].x > xmax)
			{
				xmax = points[n].x;
			}
			
			if (points[n].y < ymin)
			{
				ymin = points[n].y;
			}
			
			if (points[n].y > ymax)
			{
				ymax = points[n].y;
			}
		}
		
		var o = new mfMathPaint.Object(xmin, ymin, xmax - xmin, ymax - ymin, 8);
		o.SetOrigin(xmin, ymin);
		o.SetResizable(false);
		o.SetHasPropertyEditor(false);
		
		this.RenderPolygon(o.image.getContext('2d'), points);
		this.host.AddObject(instr.objectId, o);
		
		delete this.tmpObjects[instr.objectId];
	}
}

mfMathPaint.Modules.Polygon.prototype.GetPoints = function(instructions)
{
	var points = new Array();
	
	for (var n in instructions)
	{
		var p = instructions[n];
		
		if (p.instrName == 'POLY1')
		{
			points.push({'x':p.data1, 'y':p.data2});
			points.push({'x':p.data3, 'y':p.data4});
		}
		else if (p.instrName == 'POLY2')
		{
			points.push({'x':p.data1, 'y':p.data2});
		}
	}
	
	return points;
}

mfMathPaint.Modules.Polygon.prototype.RenderPolygon = function(ctx, points)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	
	for (var n in points)
	{
		var p = points[n];
		
		if (n == 0)
		{
			ctx.moveTo(p.x, p.y);
		}
		else
		{
			ctx.lineTo(p.x, p.y);
		}
	}
	
	ctx.closePath();
	ctx.stroke();
	
	for (var n in points)
	{
		var p = points[n];
		
		ctx.beginPath();
		ctx.arc(p.x, p.y, 2, 0, 7, false);
		ctx.stroke();
	}
}

mfMathPaint.Modules.Polygon.prototype.Clear = function()
{
	this.tmpObjects = {};
	this.objectCache = {};
}

mfMathPaint.Modules.Polygon.prototype.OnObjectDeleted = function(data)
{
	delete this.objectCache[data[0].objectId];
}

mfMathPaint.Modules.Polygon.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	
	for (var n in data)
	{
		d = data[n];
		
		if (d.instrName == 'POLY1')
		{
			d.data1 += dx;
			d.data2 += dy;
			d.data3 += dx;
			d.data4 += dy;
		}
		else if (d.instrName == 'POLY2')
		{
			d.data1 += dx;
			d.data2 += dy;
		}
		
		this.SendAndHandle(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
	}
}

mfMathPaint.Modules.Polygon.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
