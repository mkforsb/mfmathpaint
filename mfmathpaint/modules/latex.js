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
mfMathPaint.Modules.Latex = function(host)
{
	this.host = host;
	
	this.placing = false;
	this.input = false;
	this.placingImage = false;
	
	this.iconLatexOn = new Image();
	this.iconLatexOn.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIVExAOSv0BTQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAALbSURBVFjD7dlfSFNRHMDx75q2tuXIamXqZpqb0D+SrL0VhfQa9RI9SH+I7CnEjLKHKHoxQfpH2FO9FIWgFPXSQ0kj0EVJ5lzOOXWzzWoLN5uu/b09rFaGNaWXCef3eC6/ez+/c+459xyuDJBYAJEDYLFYshppMplSUICz25uzErmnqQqARSyQEFABFVABFVABFVABzT5o7EsEZ6OVTlk77pZB4sFYxhu81D5m5IKNDzeG6JS1M3LRhuuyndfbnvHxrnvWnLHrQ5g1j7DX9hD1R1JtVx10Vzzl4z333zfOPyN3hYLC46W4m+zo6g3IZLKMUP2ZCvQNRgAcJ3spOFSCcq0a7b5CvvYEZs3RnSxnSbGS4fP9yJVypITElHWSyhc7URQsyQwF4IdtNqSraYCp/knk6hxiE1E23DelkX+GypiHypjHN9cUriY7SsNSQr1BdHUG8iqXod1fhK/Dg722B/VGDYUnyv6KnNc7mggn8HV4KW/ZzLrmTfjaPEQ84Yx574+8YfVBHfp6IwU1egaOvUlfM1zfwsRzH/FgHE1VfuYz01xCrpSztWsXAbMvPaRS4t/nwsR0nECnj8BuLZOvJoiMTRN2hGaMXl5VPuO3R9GdMrB4peL/ejQZTZKMJ3lbbSYyFkZXb5jbKITiABTXGdA3GDFc28KOyb2pIiUJ5+k+KlorWXN0LUN1vfNcnn50kpT81VueW8NEPWECZj/51auI+aOpAqYTv9IkaUY+QK5WgaJEhf+hN932ue0DAJ/uulGWq1EUKSm9tJ6I9xv+J+NzX568t4YBGGp4x9gVB85zVkYv2FDoVBTWltG3r4vxO6OoN2pwtwwSC0QJO0O4mwdTRd10Euz6kp6QGx5sx9PqxHqgG1vNKxTFSlzN9tQkWq9JPdcXQWNazvvDr/G0OmeFygDJYrFk9XG5sbFRfEIFVEAFVEAFVEAFVEDnFTm/b6eyOWQskB9i3wFvlhQQvWRIWwAAAABJRU5ErkJggg==';
	
	this.iconLatexOff = new Image();
	this.iconLatexOff.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIVEw8uvMkvGwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAALkSURBVFjD7dk9SHJtHMfx73keByOXCsKKsGwIotdJkIa2CIKGokFqSU7SbsSJBoWKFnERhd5cosDBCooKawiiONAQFEI1tEQeK5KkMCTzGW5uuV/q9o5nMbh+y4Hr8D98zrnOy/XnSECWLxAdgKqqBY20WCzfoABGo7EgkcvLywD8wxeJgAqogAqogAqogApo4UETiQQzMzOYTCZmZ2dJJpN5D9Da2orX6yUYDGIymfB6vQQCAbq7uwmHw+/WLC4u0tDQgKIoPDw8ALCwsEBHRwerq6sfL5y/p6SkBJvNRiAQQJZlJEnKCx0ZGcHhcADgcrno6+ujurqazs5Ozs7O3q0ZGhqioqICj8eDXq8nk8lwfn5OKBSivLw8PxTI4d5D+v1+Li4uKCoq4vHxEZ/Pl0P+GrPZjNls5vr6Gr/fT21tLdFoFLvdTmNjI11dXWxvb6MoCvX19QwMDHyI/NQ9+vLywtbWFhMTE4yPj7O5uYmmaXnrnE4nPT09yLJMb28vY2NjuX1ut5vDw0OSySTNzc35e6a/iV6vZ21tDVVVc1OayWT+WJNKpTg6OsJqtXJyckIsFuPq6uqn2WtqaiIUCjE8PExpaen/u6LpdJrX11dsNhuxWAxZlv/q5J6fnwGw2+04HA5cLhfRaBSAbDbL1NQU09PT9Pf343a7P/d6yma/dc9vb2+5saWlJTRNQ1VV2tvbc09qKpX6re77FqCsrIyqqip2dnZyYxsbGwCEw2FqamowGo04nU7i8Ti7u7sfQv8FXLIsYzAYSCQSBINBjo+PeXp64vLykkgkwtzcHKOjo9zf3zM/P086neb29pabmxssFgvxeJyVlRUODg7Q6XQUFxdTWVmJJEm0tbXh8/nY398nEolgtVpZX19ncnKSwcFB6urquLu7Q9M0PB4PBoOBlpaWHPD09JS9vT0kIKuqakG3y4qiiE+ogAqogAqogAqogArop6L7cTlVyJH4Ij/E/gPiHB0Klp0DLgAAAABJRU5ErkJggg==';
	
	this.btnLatex = new mfMathPaint.Button(42, 42, 'LaTeX');
	this.btnLatex.AddGraphic('on', this.iconLatexOn);
	this.btnLatex.AddGraphic('off', this.iconLatexOff);
	this.btnLatex.OnClick = this.ButtonLatexClicked.bind(this);
	this.btnLatex.OnRelease = function() { this.SetActiveGraphic('off'); }
	this.btnLatex.SetActiveGraphic('off');
	
	this.host.AddButton(this.btnLatex);
	
	this.host.RegisterHandler('LATEX', this);
}

mfMathPaint.Modules.Latex.prototype.PromptForInput = function()
{
	this.input = prompt('Latex');
	
	if (this.input)
	{
		this.placingImage = new Image();
		this.placingImage.onload = function() { this.placing = true; }.bind(this);
		
		this.placingImage.src = 'mfmathpaint/latex.php?latex=' + btoa(this.input);
	}
}

mfMathPaint.Modules.Latex.prototype.ButtonLatexClicked = function()
{
	this.btnLatex.SetActiveGraphic('on');
	this.host.SetActiveModule(this);
	// this.PromptForInput();
}

mfMathPaint.Modules.Latex.prototype.handleEvent = function(event)
{
	if (!this.placing && event.type == 'mousedown')
	{
		this.PromptForInput();
	}
	else if (this.placing && event.type == 'mousemove')
	{
		this.host.ClearTopLayer();
		this.host.ctxTop.drawImage(this.placingImage, event.pageX - this.placingImage.width / 2, event.pageY - this.placingImage.height / 2);
	}
	else if (this.placing && event.type == 'mousedown')
	{
		var id = this.host.GetNextObjectId();
		
		this.host.ClearTopLayer();
		
		var x1 = event.pageX - this.placingImage.width / 2;
		var y1 = event.pageY - this.placingImage.height / 2;
		
		this.SendAndHandle('LATEX', id, x1, y1, 0, 0, btoa(this.input));
		
		this.placing = false;
		this.input = false;
		this.placingImage = false;
	}
}

mfMathPaint.Modules.Latex.prototype.HandleInstruction = function(instr)
{
	var img = new Image();
	var host = this.host;
	
	img.onload = function()
	{
		var o = new mfMathPaint.Object(instr.data1, instr.data2, this.width, this.height);
		o.image.getContext('2d').drawImage(this, 0, 0);
		o.SetResizable(false);
		o.SetHasPropertyEditor(true);
		
		host.AddObject(instr.objectId, o);
	};
	
	img.src = 'mfmathpaint/latex.php?latex=' + instr.text;
}

mfMathPaint.Modules.Latex.prototype.Clear = function()
{
}

mfMathPaint.Modules.Latex.prototype.OnObjectDeleted = function(data)
{
}

mfMathPaint.Modules.Latex.prototype.CommitMove = function(data, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	var d = data[0];
	
	this.host.SendInstruction('LATEX', id, d.data1 + dx, d.data2 + dy, d.data3, d.data4, d.text);
	
	oldObject.x += dx;
	oldObject.y += dy;
	
	this.host.AddObject(id, oldObject);
}

mfMathPaint.Modules.Latex.prototype.CommitResize = function(data, oldObject, dx, dy)
{
}

mfMathPaint.Modules.Latex.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	editor.AddProperty('objectId', data[0].objectId, true);
	editor.AddProperty('Latex', atob(data[0].text));
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.Latex.prototype.ApplyProperties = function(p)
{
	var d = this.host.GetObjectInstructions(p.objectId)[0];
	
	this.host.DeleteObject(p.objectId, true);
	this.host.Repaint();
	
	var id = this.host.GetNextObjectId();
	
	this.SendAndHandle('LATEX', id, d.data1, d.data2, d.data3, d.data4, btoa(p['Latex']));
}

mfMathPaint.Modules.Latex.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
