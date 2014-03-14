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
mfMathPaint.ObjectManipulator = function(host)
{
	this.host = host;
	this.boundingBoxes = new Array();
	this.selectedObjectId = false;
	this.selectionSet = new Array();
	this.selectionPos = 0;
	
	this.waitMoving = false;
	this.moving = false;
	this.waitResizing = false;
	this.resizing = false;
	this.mx = 0;
	this.my = 0;
	
	this.iconDelete = new Image();
	this.iconDelete.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gISDCQ5w8eLQQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAE5SURBVFjD5ZnJEcMgDEW/NRThU1yGO3YvLgM3khwyzuRgjISWwIQr8HlIYhFMAJ4YoCQA2Pe9a8h1Xd+gADDPc5eQ27YBAAiDlKTp/FgWdtsj51hQCVypXws0RUBa6CQr4Ssr3fU767jWTRrI2iDf9SWdx7KwYMkLUtKe4zHxYtKs3rNvS4ySZJbaLaYWAmLQaEhOfdjJpN3ayDsu7zwk0aWaqBdkSb9keYp2d+vEaQTIKmirsBRSfTL1YEkXUC9IU1BPSDNQb0jV7ckSkjMO9W5JNWgk5CUo50izhOQe2SQV84R0zUI93V0F5WaUGkipHllkmBELMSGwaG75zbcn6aDa1Ltq0SNnVuYofSmRhhDL9Zx8XGphaYyTp7iljuqlpOv30V9s9qEPEH8D+nH9+fvQa5kwyIfYCxTqrE/RJY4rAAAAAElFTkSuQmCC';
	
	this.iconResize = new Image();
	this.iconResize.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMFAAwINvCaIwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAB1SURBVEjH7ZZdDoAwCIMp4f5Xri8mxj0ovzFL5AB8rCvdRHYvdDYjyVtzANo+MSDANbdOS/QDWgCcBuAJclqTVYmQPYkGl5LTlxyGZFwUgmRt6oZU9sAFsUxKruFWBrw1KQMq74Z5ZKiUdUnxWZra4pb9fhUHg7scNXkr3P4AAAAASUVORK5CYII=';
	
	this.iconObjSelectOn = new Image();
	this.iconObjSelectOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gINEyU2VWMEFQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADGSURBVFjD7dlNDsIgEIbhF+ORjKy78QK9jEcw3sUzuOZUuDA0kwklmloDyceqlL+HgTZtCEBmgHQESCl1jYwxvqEA1/O9S+TldgLgwCBJUEEFFVRQQQUVtJ/v0VZ6hsdyPeV5yU95rpbX2tp2Nu/rb46o79CDawMWiC1bq7vb0n8SDR9FH/2/QC2iNXhtyXeF1iJTBvX7zU7AR77cW8tvephq+7NVx07g2370HhVUUEEFFVRQQQUVVNBf/S6X04deU2CQA7EXkupaCXSj2uYAAAAASUVORK5CYII=';
	
	this.iconObjSelectOff = new Image();
	this.iconObjSelectOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gINEyUeYNas7wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAC8SURBVFjD7dlbCoAgEAXQW7QI/1yGO3YvLmNWUh9hDMMkRQ8Url+Zr+NoUTgBWDFAWgCglNI1MqW0QwEghNAlMucMAJgxSCKUUEIJJZRQQgnt53u0lWKMx7WIHHkRccu9trqdztv6jyNqO7Rgb8AK0WVndT9b+ivRsFG00f8FqhGtwb0l/xTqRaYOavebnoCNfL13ln/0MHn7s1VHT+BuP3yPEkoooYQSSiihhBJK6Fu/y/X0odc0YZADsQ0wdmFZ2Vk6HgAAAABJRU5ErkJggg==';
	
	this.buttonObjSelect = new mfMathPaint.Button(42, 42, 'Object Selection');
	this.buttonObjSelect.AddGraphic('on', this.iconObjSelectOn);
	this.buttonObjSelect.AddGraphic('off', this.iconObjSelectOff);
	this.buttonObjSelect.SetActiveGraphic('off');
	this.buttonObjSelect.OnClick = this.ButtonObjSelectClicked.bind(this);
	this.buttonObjSelect.OnRelease = this.ButtonObjSelectReleased.bind(this);
	
	this.host.AddButton(this.buttonObjSelect);
}

mfMathPaint.ObjectManipulator.prototype.handleEvent = function(event)
{
	if (event.type == 'mousedown')
	{
		var box = false;
		
		if (this.selectedObjectId)
		{
			box = this.boundingBoxes[this.selectedObjectId];
		}
		
		if (box && event.pageX >= (box.x + box.w) && event.pageX <= (box.x + box.w + 42)
				&& event.pageY >= (box.y) && event.pageY <= (box.y + 42))
		{
			this.host.HideObjectPropertiesEditor();
			this.host.DeleteObject(this.selectedObjectId, true);
			this.selectedObjectId = false;
			this.host.Repaint();
		}
		else if (box && this.host.GetObject(this.selectedObjectId).IsResizable() &&
			event.pageX >= (box.x + (box.w - 12)) && event.pageX <= (box.x + box.w)
			&& event.pageY >= (box.y + (box.h - 12)) && event.pageY <= (box.y + box.h))
		{
			this.waitResizing = true;
			this.mx = event.pageX;
			this.my = event.pageY;
			this.host.Repaint();
		}
		else
		{
			this.host.HideObjectPropertiesEditor();
			this.selectedObjectId = false;
			this.waitMoving = false;
			
			var selectionSet = new Array();
			
			for (var objectId in this.boundingBoxes)
			{
				if (this.host.GetObjectInstructions(objectId).length < 1)
					continue;
				
				box = this.boundingBoxes[objectId];
				
				if (event.pageX >= box.x && event.pageX <= (box.x + box.w)
					&& event.pageY >= box.y && event.pageY <= (box.y + box.h))
				{
					selectionSet.push(objectId);
				}
			}
			
			if (selectionSet.length > 0)
			{
				if (selectionSet.join(',') != this.selectionSet.join(','))
				{
					this.selectionPos = 0;
					this.selectionSet = selectionSet;
				}
				
				this.selectionPos = (this.selectionPos + 1) % this.selectionSet.length;
				this.selectedObjectId = this.selectionSet[this.selectionPos];
				this.host.ShowObjectPropertiesEditor(this.selectedObjectId);
				this.waitMoving = true;
				this.mx = event.pageX;
				this.my = event.pageY;
			}
			
			this.host.ClearTopLayer();
			this.PaintSelectionMarker();
		}
	}
	else if (event.type == 'mousemove' && this.selectedObjectId)
	{
		var obj = this.host.GetObject(this.selectedObjectId);
		
		if (obj && obj.IsMovable() && this.waitMoving && (Math.abs(event.pageX - this.mx) > 5 || Math.abs(event.pageY - this.my) > 5))
		{
			this.host.HideObjectPropertiesEditor();
			this.host.BeginMoveObject(this.selectedObjectId);
			this.waitMoving = false;
			this.moving = true;
		}
		else if (obj && obj.IsResizable() && this.waitResizing && (Math.abs(event.pageX - this.mx) > 5 || Math.abs(event.pageY - this.my) > 5))
		{
			this.host.HideObjectPropertiesEditor();
			this.host.BeginResizeObject(this.selectedObjectId);
			this.waitResizing = false;
			this.resizing = true;
		}
	}
	else if (event.type == 'mousemove' && this.moving)
	{
		this.host.MoveObject(this.selectedObjectId, event.pageX - this.mx, event.pageY - this.my);
	}
	else if (event.type == 'mousemove' && this.resizing)
	{
		this.host.ResizeObject(this.selectedObjectId, event.pageX - this.mx, event.pageY - this.my);
	}
	else if (event.type == 'mouseup')
	{
		if (this.moving)
		{
			this.host.EndMoveObject(this.selectedObjectId, event.pageX - this.mx, event.pageY - this.my);
			this.selectedObjectId = false;
		}
		else if (this.resizing)
		{
			this.host.EndResizeObject(this.selectedObjectId, event.pageX - this.mx, event.pageY - this.my);
			this.selectedObjectId = false;
		}
		
		this.waitMoving = false;
		this.moving = false;
		
		this.waitResizing = false;
		this.resizing = false;
	}
}

mfMathPaint.ObjectManipulator.prototype.SetObjectBoundingBox = function(objectId, x, y, w, h, capabilities)
{
	this.boundingBoxes[objectId] = {'x':x, 'y':y, 'w':w, 'h':h, 'caps':capabilities};
}

mfMathPaint.ObjectManipulator.prototype.RemoveObjectBoundingBox = function(objectId)
{
	delete this.boundingBoxes[objectId];
	
	if (this.selectedObjectId == objectId)
	{
		this.selectedObjectId = false;
		this.host.HideObjectPropertiesEditor();
		this.host.ClearTopLayer();
	}
}

mfMathPaint.ObjectManipulator.prototype.ButtonObjSelectClicked = function()
{
	this.buttonObjSelect.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
}
mfMathPaint.ObjectManipulator.prototype.ButtonObjSelectReleased = function()
{
	this.buttonObjSelect.SetActiveGraphic('off');
	this.selectedObjectId = false;
	this.host.HideObjectPropertiesEditor();
}

mfMathPaint.ObjectManipulator.prototype.PaintSelectionMarker = function()
{
	if (this.selectedObjectId == false)
		return;
	
	var box = this.boundingBoxes[this.selectedObjectId];
	
	if (box)
	{
		var ctx = this.host.ctxTop;
		
		ctx.lineWidth = 1.5;
		ctx.lineCap = 'square';
		ctx.strokeStyle = '#7777ff';
		ctx.beginPath();
		ctx.moveTo((box.x - 4), (box.y - 4));
		ctx.lineTo((box.x - 4) + (box.w + 8), (box.y - 4));
		ctx.lineTo((box.x - 4) + (box.w + 8), (box.y - 4) + (box.h + 8));
		ctx.lineTo((box.x - 4), (box.y - 4) + (box.h + 8));
		ctx.lineTo((box.x - 4), (box.y - 4));
		ctx.closePath();
		ctx.stroke();
		
		ctx.drawImage(this.iconDelete, box.x + box.w, box.y);
		
		if (this.host.GetObject(this.selectedObjectId).IsResizable())
		{
			ctx.drawImage(this.iconResize, box.x + box.w - 24, box.y + box.h - 24);
		}
	}
}
