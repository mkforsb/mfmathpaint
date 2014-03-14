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
mfMathPaint.Button = function(width, height, tooltip)
{
	this.width = width;
	this.height = height;
	this.hitbox = {'x':0, 'y':0, 'w':0, 'h':0};
	this.graphic = {};
	this.activeGraphic = new Image();
	this.tooltip = tooltip;
	this.subButtons = new Array();
	this.isSubButton = false;
	
	this.OnClick = function() {};
	this.OnRelease = function() {};
}

mfMathPaint.Button.prototype.AddGraphic = function(name, image)
{
	this.graphic[name] = image;
}

mfMathPaint.Button.prototype.AddSubButton = function(button)
{
	button.isSubButton = true;
	this.subButtons.push(button);
}

mfMathPaint.Button.prototype.IsSubButton = function()
{
	return this.isSubButton;
}

mfMathPaint.Button.prototype.HasSubButtons = function()
{
	return (this.subButtons.length > 0);
}

mfMathPaint.Button.prototype.GetSubButtons = function()
{
	return this.subButtons;
}

mfMathPaint.Button.prototype.DrawTooltip = function(ctx, x, y)
{
	ctx.font = '10pt sans-serif';
	
	var width = ctx.measureText(this.tooltip).width;
	
	ctx.lineWidth = 1.0;
	ctx.strokeStyle = '#000';
	ctx.fillStyle = '#e6e68a';
	ctx.beginPath();
	ctx.rect(x + 8, y + 8, width + 16, 20);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	ctx.fillStyle = '#000';
	ctx.fillText(this.tooltip, x + 16, y + 22);
}

mfMathPaint.Button.prototype.SetActiveGraphic = function(name)
{
	this.activeGraphic = this.graphic[name];
}

mfMathPaint.Button.prototype.SetHitbox = function(x, y, w, h)
{
	this.hitbox = {'x':x, 'y':y, 'w':w, 'h':h}
}

mfMathPaint.Button.prototype.GetHitbox = function()
{
	return this.hitbox;
}

mfMathPaint.Button.prototype.PaintOnto = function(ctx, x, y, w, h)
{
	ctx.drawImage(this.activeGraphic, x, y, w, h);
}

mfMathPaint.Button.prototype.IsClicked = function(x, y)
{
	return (x >= this.hitbox.x && x <= (this.hitbox.x + this.hitbox.w)
		&& y >= this.hitbox.y && y <= (this.hitbox.y + this.hitbox.h));
}
