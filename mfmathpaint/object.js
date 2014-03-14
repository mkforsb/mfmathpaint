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
mfMathPaint.Object = function(x, y, width, height, padding)
{
	this.padding = (padding === undefined) ? 2 : padding;
	
	this.x = Math.round(x) - this.padding;
	this.y = Math.round(y) - this.padding;
	this.width = Math.round(width) + 2 * this.padding;
	this.height = Math.round(height) + 2 * this.padding;
	this.image = document.createElement('canvas');
	this.image.width = this.width;
	this.image.height = this.height;
	this.image.getContext('2d').translate(this.padding, this.padding);
	
	this.canMove = true;
	this.canResize = true;
	this.propertiesEditable = false;
}

mfMathPaint.Object.prototype.Clone = function()
{
	var o = new mfMathPaint.Object(this.x + this.padding, this.y + this.padding,
		this.width - 2 * this.padding, this.height - 2 * this.padding, this.padding);
	
	o.canMove = this.canMove;
	o.canResize = this.canResize;
	o.propertiesEditable = this.propertiesEditable;
	
	o.image.getContext('2d').drawImage(this.image, -this.padding, -this.padding);
	return o;
}

mfMathPaint.Object.prototype.SetOrigin = function(x, y)
{
	this.image.getContext('2d').translate(-x, -y);
}

mfMathPaint.Object.prototype.SetMovable = function(val)
{
	this.canMove = val;
}

mfMathPaint.Object.prototype.SetResizable = function(val)
{
	this.canResize = val;
}

mfMathPaint.Object.prototype.SetHasPropertyEditor = function(val)
{
	this.propertiesEditable = val;
}

mfMathPaint.Object.prototype.IsMovable = function()
{
	return this.canMove;
}

mfMathPaint.Object.prototype.IsResizable = function()
{
	return this.canResize;
}

mfMathPaint.Object.prototype.HasEditableProperties = function()
{
	return this.propertiesEditable;
}
