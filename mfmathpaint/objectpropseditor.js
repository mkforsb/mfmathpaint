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
mfMathPaint.ObjectPropertiesEditor = function()
{
	this.properties = {};
	this.OnCommit = function() { alert('commit!'); }
}

mfMathPaint.ObjectPropertiesEditor.prototype.AddProperty = function(name, value, hidden)
{
	if (hidden !== true)
	{
		hidden = false;
	}
	
	this.properties[name] = {'value':value, 'hidden':hidden};
}

mfMathPaint.ObjectPropertiesEditor.prototype.Show = function(wrapElement, obj, focusedField)
{
	var numProps = 0;
	
	for (var key in this.properties)
	{
		if (!this.properties[key].hidden)
		{
			++numProps;
		}
	}
	
	var html = '';
	
	if (focusedField === false)
	{
		html += '<div class="mfmathpaint-object-props" onclick="javascript:this.style.height=\''+(48 + (40 * numProps))+'px\';" style="width:164px; height:20px; overflow:hidden; left:'+obj.x+'px; top:'+(obj.y - 24)+'px">';
	}
	else
	{
		html += '<div class="mfmathpaint-object-props" style="width:164px; height:'+(48 + (40 * numProps))+'px; overflow:hidden; left:'+obj.x+'px; top:'+(obj.y - 24)+'px">';
	}
	
	html += '<p style="font-weight:bold; padding:2px; margin-top:0px; margin-bottom:4px;">Properties</p>';
	html += '<form method="post" action="index.html">';
	
	for (var key in this.properties)
	{
		if (this.properties[key].hidden)
			continue;
		
		html += key + ':<br /><input type="text" name="' + key + '" value="' + this.properties[key]['value'] + '" /><br />';
	}
	
	html += '<input type="button" name="commit" value="Ok" />';
	
	html += '</form></div>';
	$(wrapElement).append(html);
	$(wrapElement).find('div.mfmathpaint-object-props input[name=\'commit\']')
		.get(0).addEventListener('mouseup', this.PreCommit.bind(this));
	
	if (focusedField)
	{
		$(wrapElement).find('div.mfmathpaint-object-props input[name=\''+focusedField+'\']').focus();
	}
}

mfMathPaint.ObjectPropertiesEditor.prototype.PreCommit = function()
{
	var result = {};
	
	for (key in this.properties)
	{
		result[key] = this.properties[key]['value'];
	}
	
	// get values from form
	$(document).find('div.mfmathpaint-object-props input').each(function()
	{
		result[this.name] = this.value;
	});
	
	this.OnCommit(result);
	this.Hide();
}

mfMathPaint.ObjectPropertiesEditor.prototype.Hide = function()
{
	$(document).find('div.mfmathpaint-object-props').remove();
}
