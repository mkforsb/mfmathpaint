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
mfMathPaint.Modules.GeometricShapes = function(host)
{
	this.host = host;
	
	this.painting = false;
	this.mx = 0;
	this.my = 0;
	
	this.toolButtons = {};
	this.tool = 'circle';
	this.manip = '';
	this.selectedPoint = false;
	this.selectedObject = false;
	
	this.moveOps = {};
	this.resizeOps = {};
	
	this.objectCache = {};
	this.pointCache = {};
	
	this.tmpObjects = {};
	
	this.iconGeometricObjects = new Image();
	this.iconGeometricObjects.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIaDwIV9TPyMAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEpSURBVFjD7ZlBDoQgDEW/hEO46zG8MXfxGJ5kZjHBkInYAu0IGVhqhUdpf2tYALwwwPAAsO9715Dbtn1AAWBd1y4hQwgAANcDDBGxNm4EyMdBiQjHcfQPWjLcCN58DLQU8hHQGshT8LUylAOohRSDpoC5hYjotKuFqQaVAH6/zwG3ePM2RtPFShZI7eMcrZBZUI0jTGE1QsHVJkYJrIngS2tvSRJqzOmsPBGPXMurJoKvFZemoBaQxZVJGs9Xz7k45TTbt3qFE3WJ1KXf5TbktBLpbnMaoeA1Yo2TIQ158jkPxJotgb2y0W5Q2MqUNhlS71p0Ub6lI6rttMzk6c671oBVOnolPZZw83d5grbWeu3+1Qz0V4k0Y3SCTtC/1tF4+9DrWDDIhdgbCO+kDycC6TAAAAAASUVORK5CYII=';
	
	this.btMain = new mfMathPaint.Button(42, 42, 'Geometric Shapes');
	
	this.MakeTool('Manipulate', 'Manipulate', 'manipulate',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIcADsh9DST3gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAP5SURBVFjD7ZnNa1xVGIef95xzZzKT+NHaCiKCClGcKo3SJkWamAjVTdEyUXDnH6B/gHsXimvFhSsXBRemRnQjFSeNQUwQbVHrIkuhIBjEVpNMcu95XZyZ25lO7mQ+EjtBz8CdgTn33Oe8H7/3vfcKoByA4QCWl5cHGnJiYiKAArwx/s5AQj739gkAzCDAVGRu1znmIEDedtCKzDGjs4MP2s0wB8Gatw20W8hURzseCpoouu3xGx6/7cEr4gSTt0jeIE7AgIjsGWRXoKrKgrnQds7p389iig6TM6jRFtheITNBxQsIqGiLhEzeeJH4jy2q1zb5/lQFgGMfT/DzS8ssHfkcgKn1c5mwfZXQFuuJgjQDTvsyGivJ3zF+PSFeq6aWFhEe/eAphh4scuXMEovF+XBOXE5h+7FmNmiDm+uLq2poXzz4qie+ETfNFxFG3xvj+BenyT9QYKV0kQV3gem4TMX1B5mZ9Qu2GfKWXaCJ4jd9y+ZWX7vM+upfVH/dYPzqmbBWDVZV90dHsyygWjskuqMnVl9vhfXVJKiF156BTU+1V8m8YCPsSukiAIvDn6JVjyba9tyuY3Tal/tyUxqz745RHB3hyvNLxDdi7LDF5AziulcExz6NOuwj7z8JQLy2BT6CEYcBJDIoYU4nwPsG2ggLsL1WRSJBolr1sopY6TgMXFYMInsL+8Mzi9mJYkxTbuyUyC5LntrqntCRuxrnjFWmyN83hDsUYUcckjOIDW6/ZD9Jr5eVzGYnWdoVQmTXvktEOPry/QA8PncKd1eEGbahebHNcWmM6T1Gs0qeGEFs6JY6jc+fZr9tuyFrbY/ylJSpmLlWWAk+kJxg73A7uvjW5HjozRIjY3dTHB0hujePHXYhmRrCx6jB43ur9TM6S0Xm0piZ9uWwuDPYoiM6kkshH37rGPGfMVu/bSJyM5PrVi2dP0mykeBirZU26bqraitPjQFeb1KmNs5hhy25o/mQJF9Nkqwn/Hj2m8x14uuh49Jtj3oQbQ4NL75HUMkGXizMN/13+dmv09+lj8a5+srKjlYdq0yhsYLvrdZ3JfgzOhsaCx+akktD80xefwHdCm3f1rVNHvvwBL+8+l3r3p30dYfWdWUSI7WkqiVCwaKRwRmBJLSApfMnm2Lwic+ext0ZYXIGrHSsw32XUBFJw6NRE92hHEiAP/7lJLrtMXlDdDiHOxxhCkFDe6l6fdd6EUGNYiIDRYhsHlOwRPfk0CTcodqCxRRuiv2/4vpO+te6hRszu11h2HfQxmKgqkjto14RXyu19a86cAN3J7K0521eakUULKitt2HNxwP37Ol/0IEE3avHMP9Ji6ZZX3/7MKhDOCAvxP4Buzq5G0ACLbgAAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIcADojAyHDswAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAASWSURBVFjD1Zm/S/NOHMffl1ximiqWKuIibRxscXLzH3ATHAURFycHJx100UEQnISCoIuTqB39A9zFzUWxS9tMIggVqdamyd0zfL93pG3SprYP+BwUmubIve7z850rAcDxDwwKAPf3978acn5+/j9QAJicnPyVkFdXVwAA5TfApFKpaK4f5HAcR37nnIMQAgAghIAQAkVRoChKT5ADsSjnHJxzMMbAOQelFJqmgVIKXdehaZq8ppRKcAFp23b0ZOoFSliHMSYX9VtOWIsQ0vS7GK3XPWV9L0MAAABjLPBeGGRrXEa1ZmRQASbgOOfwPA+e54FzDlVVoaqqjEPxGRRkZFC/ixljcF0X9XodjuNIUF3Xoes6KKUdrRkEKcJFGMTzPFBKf+Z6zjnS6XTHOQ8PD4jFYtA0DYqitMGGWdIfTn7wrlkv3OtfQEA+PT3h7u4ONzc38v7p6SkAYG5uDplMBo1Go+0ZUZM0LOFomKsJIU01rlwuw3VdfH19oVaroVKpNGX80dERpqamsLq6ikwmAwAoFovSst3isls1UMJ2KCBt25YLiJrpOA4+Pz+b5u/u7qJYLOLi4gK3t7cAgOnpaTDGukKK54pNB0EHglqWJSGDHup5Hur1etvve3t7KJVKeHl5aYItFosdw6A1+YLmhnamMAuInXueF3hvf3+/DdZxHHie1zVuO8Wo8hOBELbrVtiFhQUAQDablbBiowPpTOVyue/+TwjBwcEBLMvC2toaqtUqTNOUfT+ofAVVgL+mnlphDw8PAQDv7+/gnMM0TQCApmlNFaaTl/4qaGuSVCoVqaAopWCMQVVVCeefGwRMo2ThIGCXl5fDa6SiIJvNwjRNJJNJmYRdQS3L6ioaomzEPyefz2NiYgKjo6OIx+PQNE0KGcuyUCgUwDnH0tJStKy3bbsrhFDq3eYsLi4CAM7OzjAyMgLTNKHrelsiKYoi3S1ETeQYDesmiqJItRQ1Pjc2NjpuSFXVrl4KBC2VSkin022wIkM1TUM8Hg90cas1tre3MTs7C8uyMD4+jlgsJl9JgpJH1NpI5YlzDtu2kUqlZAMol8sghIBSilgshmQyKSF3dnbw8fGBt7e3JskmFszlcvj+/obruqF1Usx3Xbf38iSs6Zd5hUIBpmlibGwMAHB9fY1arYb19fXQ51SrVdRqNQnqFyCtelS02tYcoFEy2g8sJJwYKysr8vvJyQk2NzcDrZrP5+G6btt7Vms8Pz8/t6n7ngu+bdtgjIExBs/zMDMzg8fHRzQaDVSrVby+vuL4+BhbW1vtC/3fNn9a6nruTKK0iEUNw5AQYhO5XK5p8fPzcwwPDze9ovTaUH7UQv0LiaINAKOjoyCEwDAMXF5ewnVd6LqORCKBRCIBwzCa5vfSDfvu9cK6QmQoioKhoSEkEgnZzw3DgGEY0HVd1sxe3d83aJB+DTpB6Ufj9g3qbwZBhxRBoRIEHuVkZWAyz1+S/AcKUXTDX0umXuB/6uqBHzt2eoVoBfW/L/lLXJRyRQdtPf9pXpQTkL5c34+67wTVz/gVZ/g9WVT8+/BbB8E/8ofYH2z6dPSt94zgAAAAAElFTkSuQmCC',
		undefined, undefined);
	
	this.MakeTool('Circle', 'Circle', 'circle',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFg0Zel+VxQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEoSURBVFjD7Zk9DoMwDIUfVq6EWNm6c5megctwBlYuBR0qWlQRbOc/FR4RiT/8bCs4DYANFZgBgGVZiobsuu4NCgDPdiwS8jG234j62EyT6L1+HfyljwVnW+MCbUIB2pyfrdmfaYCND6TE0fGd3z1mmsSwJhbgFfRxT2l0KRUktweX98Zn8xCw0sKkWFXqEoAraArVfkKZzTelltzVB+WSXJsChEqMckqu8UmlFBFXVHVLn0N2znf9xXSD3qAlg1Z5KCkyojn7J9dPSStBDtnrLibpr0HMaJ6lIPnIkULy/zmUpEoB6a+PeqQTKtraj6fQEw1XSC4ARpozLvOiEIBq6ft1OJ3GcQ5dRpVeoLbouqRE9EGuT0fIMhrP0XM/oPvtQ6nWoJILsRdhC5KukfUA8wAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFgsUUrRO/gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEjSURBVFjD7ZnNDYMwDIUfVobgljHYmF0YI5O0h4oWVYTYsfOH8BGR+MPPtoIzAXhhAHMAsG1b15DLsnxAAWCe5y4h13X9RVRj3nvWeyEEvfSl4GJrcqCdFWDM+dma/ZkE2GkgOY6O7/zv4b1nw7pSgFfQxz250aVakKk9UnnvNJtbwHILk0pVaU4ArqDJqv1YWcw31ZY81we1klyaAoRBjFpKLvFJvRRRqqjGlr6F7Cnf4xfTA/qA9gw65KGky4i27J+pfkpSCVrIPnYxcX8NSkbzLAVJI0cNye9zKKmVAtxfH/FIxyra0o8n64lGLmQqAI6bMznzIgtAsfQhhNNpXMphzqhSBRqLbk5KFB/kajpCk9F4i577Bd1vH3q1CYNciL0BusyTm4cFdlAAAAAASUVORK5CYII=',
		{'dx':'0.data1,0.data3', 'dy':'0.data2,0.data4'},
		undefined);
	
	this.MakeTool('Ellipse', 'Ellipse', 'ellipse',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFg0NYIVBuAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEWSURBVFjD7Zk9DoMwDIUfVq6EWNm6c5megctwBlYuRTtUVFVEfkyckKj2iIj94TjOC+kAvNCAGQDYtq1qyGEYPqAA8OznKiEfcw8AIDRiCqqgCvpvoCZl8EoL6/1xn8qAcsFC4zngRgIwFNA1/ngeA2yuBOBOof2+7TcGmDiQ4z4l1VnIj2/mKLaWJABjgF2wJFnwKcAhWMrVTlJhvaC/X1IS8iymndW2t9A7shmK3XZGU7fKHPqhzYz6Vl3pbNq1SjnVkqQyoyu7RG7Is5Uf1Z5WWrIAn/lltyeXupEAdvnx9W8T03xd+jFVOHM2mCiF7wJOrWPxo4jUQit2uLtTE+gPCAVVUAWt1L599Lh9qNU6NHIh9gaWC32msDJQKQAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFgsfxWaXdgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEPSURBVFjD7ZlBDoQgDEW/DYdwxzG8sXfxGJxkZjFxMiECrQWETLs00j5LKR9ZALwwgTkAOI5jaMht2z6gALCu65CQ+74DAAiTmIEaqIH+G6jTDPbei94PIfQBlYKVxkvAXQ3AUsDU+PM5B9jdCSCdwvj92C8HmCSQIQRVnZX85GaOuLVUA5ADnIKlmgWvAS7BUqt2ooXNgv5+SU/Iq5hxVufeQp/IZin23BnVbpUt9MOcGc2tut7ZjGuVWqqlmsqM7uwSrSGvVj6rPXnvmwBf+RW3p5S6qQGc8pPr347TfFP6USucJRsMS+GngLV1XP0oUmuhdTvcPakJ7AeEgRqogQ5q3z563j6MagsmuRB7AwOafpMJeSdjAAAAAElFTkSuQmCC',
		{'dx':'0.data1,0.data3,1.data1', 'dy':'0.data2,0.data4,1.data2'},
		undefined);
	
	this.MakeTool('Triangle', 'Triangle', 'triangle',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA4QDhAOGT2j1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMFACItdvNHSAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAD9SURBVFjD7dkxDoMwDAXQHytHqsrM0gtwmR6h6l04AzOnSoeKLgXkENtxBJ7Y8vRNYkUJABIaqAgA8zy7RnZd94UCwPP+dol8vG4AAEIjdUGbgE5h9A9dkNJY0kxSEqv+j0phSQPUpwF9GkSxpIFc+y7Fnud42kpTOlXSREpizVpfiiXtNKWwZIUsxVbZ9UewZJlmCZZqIJs78HNSpdppcrHkoeUcbKzZ+i3UFMa/QKJlmtyjaG2dqInMnT57a0SLVh6BsaGcNDVhLOgW0hKW3focnOa0il5hRZvJer7vQvs0/FKtCWMl6gl4vuvyBb2gVrt+eX3wWgGNPIh9AAkzgF1pIrXKAAAAAElFTkSuQmCC',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA4QDhAOGT2j1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMFACIRWZw7zwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAD0SURBVFjD7dm9DcQgDAXgF4sh0jFGNmaXjOFJ7opTrsmPTLCNUeIqHZ+eAxZiAvDBAJUAYF3X0MhlWX5QAJjnOSSylAIAIAxSL3QIaM45PnRDamPJMklNrPk/qoUlCxAzg5lVsWSBPPpuxT7neDpLUztVskRqYt1a34ol6zS1sOSFbMV22fV3sOSZZguWeiCHO/BrUqXeaUqxFKHlEmzq2fozVM55F0jyTFN6FB2tkyyRtdPnao3k0co7MDFUkqYlTAQ9Q3rCqltfg7OcVikqrGkzec/3Sygz/1PtCRMlGgn4vOvyC32hXrt+e32IWhMGeRD7AqWjfQ1qAuQTAAAAAElFTkSuQmCC',
		{'dx':'0.data1,0.data3,1.data1', 'dy':'0.data2,0.data4,1.data2'},
		undefined);
	
	this.MakeTool('RightTriangle', 'Right Triangle', 'righttriangle',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA4QDhAOGT2j1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMFACApQ6jh0wAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADISURBVFjD7dnBDcIwDAXQH9SREDlzYQGWYQTELp2h50xVDhUSICht47g/9HuA6OlbShw5AOhRQTUAkFKiRsYYBygAXA43SuTpugcA7FBJCSqooP8M7UL7+cJnBlJBx4AUre9C+4I89meuRN8THAOuAl0CdIXmAF2gFsCiUEtgEWgJoCm0JNAE6gHMgnoCF0GtgVOezlnQNRKcBfUCPp/7LeWGNcGf0KnTDHXrNzuPZiXK1G79QgUVVFBBBa3gCX1sH1groJKF2B2bbERFxV8iiwAAAABJRU5ErkJggg==',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA4QDhAOGT2j1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMFAB8v8hVu2gAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADASURBVFjD7dnRDcMgDATQS5Qh+PMYbMwujMEk7UdVKYnSNAnGOVp7APR0lsDIA4AHOqgJAHLO1MgY4wsKACEESmRKCQAwopNyqEMd+stQEdm+8JmBVNA9IEXrRWSBLKVwJbpOcA94C/QK0BRaAzSBagCbQjWBTaAtgKrQlkAVqAWwCmoJvATVBh55Ok9B70jwFNQKOD/3U8oTa4JfoUenGerW/+08WpUoU7v9F+pQhzrUoQ7t4Al9bx9Ya0AnC7EnZn0+1VWn7F0AAAAASUVORK5CYII=',
		{'dx':'0.data1,0.data3', 'dy':'0.data2,0.data4'},
		undefined);
	
	this.MakeTool('Rectangle', 'Rectangle', 'rectangle',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFg0jvFNMdwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACISURBVFjD7dmxCYAwEEbhp7hSSGtn7zLOkGWcwTZLqYVYChYqibx/gi8Xjju4BtioIB1AzrloZIzxgAJMIRWJHFIAoKWSCBUqVKjQB0boVZZ2/hTTr+PPK3rnpU/kzs/ZTEKFChUqVKjQeranr/fS/1b07T3UZhIqVKhQodeT6bw+lJqGSg5iOxUOEZ74HnHZAAAAAElFTkSuQmCC',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFgsIRrUSsQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACDSURBVFjD7dnBDYAgDEbhp3EIbozBxuzCGEyiB+PRhAMSMO+f4KOkaZNuwMkCOQBKKVMjU0o3FCCEMCUy5wzAziIRKlSoUKEdRuhbYoxDMbXWn1e05aU90vJzNpNQoUKFChUqdJ3tafRe+t+Kfr2H2kxChQoVKvR9Mj3Xh1mzschB7AJELxKLu+1ZyAAAAABJRU5ErkJggg==',
		{'dx':'0.data1,0.data3', 'dy':'0.data2,0.data4'},
		undefined);
	
	this.MakeTool('Parallelogram', 'Parallelogram', 'parallelogram',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFg0Dhz1svwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAC0SURBVFjD7dmxDYMwFIThH4uVkNt09CyTGViGGdJ6qUARRUoRFMDBPD/dGwA+7iRjcAPMVDAtQErJNDLG+IIC3LvRJLIfOwAClYygggoqqKCCCnp897R3HmE6FXV7DvmJno1cu4fP6j+f9Fs9/0oxq/orkf6Wp6vT9JWohTR/Qq0gfVRvKc36E7WW5qZXaIlNyKFES8H2NhVyL1ACuVp9Cay+mQQVVFBvPyDepw9Wp6GSA7EFNGRBnkOt2n8AAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFgwLkP3VzAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAACuSURBVFjD7dnRDYQgEIThX3NF8EYZdEwvlEEl54O55B40nnLispktQD9nEkSZgDcDzAuglGIamVJaoQAhBJPInDMAM4OMoIIKKqigggp6ffd0dmKMt6Jqre2J3o3cu4fP6r+fdKuef6XYVP2TSH/L09Np+krUQpqHUCtIH9VbSnP8RK2l+dMrtMcm5FKivWBnm5pbL9ADuVt9D6y+mQQVVFBvPyA+pw9WZ2KQA7EFNUNCixlDL54AAAAASUVORK5CYII=',
		{'dx':'0.data1,0.data3,1.data1,1.data3', 'dy':'0.data2,0.data4,1.data2,1.data4'},
		undefined);
	
	this.MakeTool('Rhombus', 'Rhombus', 'rhombus',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMGCQkBLz9CowAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAESSURBVFjD5dm7DQIxEATQuREtnZySkdMMNVwz1EDqpjgCdIgATtie8UdsBU+WvLNeTwBWDFAHAIgxdo0MITyhAHCZly6Rp2UGABCDlBx647V/6IZ0YOk6STWWauTxfrZg6UA6sHScpANLB9KBpQupxtKJVGLpRqqwrIFUYFkLWYplTWQJlrWRuVi2QOZg2QqZimVLZAqWzthTtj66M1rVVejOaFVXYY2BQnFhqWwhzjimsoU445jKFuKM46QxrwRb2p+TB+ccrCJEsp4iKVhV0mU/7n7BKuO46Lm8h1XPDMULiE9Yx2AjWel8O1nl9CVbku1tSrqCvuMcc6x8kesatv93Ne6q16/I9vvQa00Y5EPsActHvJYQUKh6AAAAAElFTkSuQmCC',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMGCQgodJbrjgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAEMSURBVFjD5dnRDcMgEANQx+oQ/DEGG2cXxmCS9qNK1Y82KmATUG+CJyTOx7EBuGOBugFAznlqZErpCQWAEMKUyH3fAQDEIiWHxhjnhx5IB5auk1RjqUaWUixYOpAOLB0n6cDSgXRg6UKqsXQilVi6kSosRyAVWI5C9mI5EtmD5WhkK5ZXIFuwvApZi+WVyBosnbGnbH10Z7Sqq9Cd0aquwhEDheLCUtlCnHFMZQtxxjGVLcQZx1VjXg+2tz9XD84tWEWIND1FarCqpGt+3P2CVcZx13P5DKueGboXEJ+wjsFGstL5drLK6Uu2JDvblEwFfcc55lj5Itc1bP/vatxVr1+R4/dh1tqwyIfYA8D4vYPEX0DAAAAAAElFTkSuQmCC',
		{'dx':'0.data1,0.data3', 'dy':'0.data2,0.data4'},
		undefined);
	
	this.MakeTool('Ngon', 'Regular N-gon', 'ngon',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFgwxVvEMfgAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAGASURBVFjD7ZmxSgNBEIa/W0+jELjGJpAiIAiCRQpDGouAhZVNXsBC7Oy1s44PYO8DeIX4AAfapEgjgkFQELEQC4uQ2Jg7C8mBopjszp0b2Kn2jjnmY3Z35t9bD0iYAvMB2u221ZD1ev0TFGC/1rIScrNVA0AxJeZAHagDlayjOhapcGzfRtz8n4xOAqnjLwKqG9QU1tcNNsl0jr6LVKi9DFTWkN/9dTOrsoaUglV5QErAqrwgTWGVKWSkQiIVMhy8093pcBGccbl4zt3BNUmSiMH6CFl3u8PL6VP6/Hh0S6G8QHlvya4W+nbfZ+1qg/XXLUq7FQCeTx7s6/XLx1WKqwF+MEvlcAWA/k3PPtBiNUjHc6V5AOLB0D5QVZhJx57nOT3qQDMHlRASkh1Pmba7Rtz8Mdhv73Xb8p9TL5lZE+0w1hqVgDUVOGNvJhNYCRU2kShpxM0vxwoTiZd5eZJQ+LnVUZMzU+4/IKQUv2uhDtSB5mzprh/dPthqHlNyIfYBx9yRZI/b8C4AAAAASUVORK5CYII=',
		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACoAAAAqCAYAAADFw8lbAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gIZFgwXhPyJgwAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFfSURBVFjD7ZkxjoMwEEUfFhJdyojOZSRSpMxdUnEEhMQNKHIDbkCVmiI3SJ02jXMJSrZYBWlXu1piD6yRPJVBg+ZpbM984wgYWIHFALfbzWvI4/H4CQqQpqmXkG3bAqBYiQXQABpAJeuojWmtJ/saY/4no+9A2viLgNoGdYWNbYO9M52v77TW1stAzQ353d82s2puSClYtQSkBKxaCtIVVrlCaq3RWtP3PVVVsd/vORwOnM9nhmEQg40RsrIs6bpufG6ahjRNyfPcrxb6fD65Xq/c73dOpxMAl8vFv15f1zW73Y7NZkNRFAA8Hg//QLMsG8fb7RaAvu/9A02SZBxHURT0aACdHVRCSEh2POXa7owxPwb77b1tW/5z6iUz66IdJq1RCVhXgTN5M7nASqiwt0SJMebLscJF4s1eniQU/mJ11OXMtPgPCCnFH1poAA2gC9u461+3D75axEouxD4Ag8aTii/ubzEAAAAASUVORK5CYII=',
		{'dx':'0.data1,0.data3', 'dy':'0.data2,0.data4'},
		undefined);
	
	this.btMain.AddGraphic('default', this.iconGeometricObjects);
	this.btMain.OnClick = this.ButtonMainClicked.bind(this);
	this.btMain.OnRelease = this.ButtonMainReleased.bind(this);
	this.btMain.SetActiveGraphic('default');
	
	this.host.AddButton(this.btMain);
	
	this.host.RegisterHandler('GEOM', this);
}

mfMathPaint.Modules.GeometricShapes.prototype.MakeTool = function(name, displayName, toolName, dataOn, dataOff, moveOps, resizeOps)
{
	this['icon' + name + 'On'] = new Image();
	this['icon' + name + 'Off'] = new Image();
	this['icon' + name + 'On'].src = dataOn;
	this['icon' + name + 'Off'].src = dataOff;
	this['bt' + name] = new mfMathPaint.Button(42, 42, displayName);
	this['bt' + name].AddGraphic(toolName + '-on', this['icon' + name + 'On']);
	this['bt' + name].AddGraphic(toolName + '-off', this['icon' + name + 'Off']);
	this['bt' + name].SetActiveGraphic(toolName + '-off');
	this.btMain.AddGraphic(toolName + '-on', this['icon' + name + 'On']);
	this.btMain.AddGraphic(toolName + '-off', this['icon' + name + 'Off']);
	this.btMain.AddGraphic(this['bt' + name]);
	this.btMain.AddSubButton(this['bt' + name]);
	
	this.toolButtons[toolName] = this['bt' + name];
	
	this['bt' + name].OnClick = function() {
		this.ResetButtonIcons();
		this['bt' + name].SetActiveGraphic(toolName + '-on');
		this.btMain.SetActiveGraphic(toolName + '-on');
		this.handleEvent = this['Handle' + name + 'Event'];
		this.tool = toolName;
		this.host.SetActiveModule(this);
	}.bind(this);
	
	this.moveOps[toolName] = moveOps;
	this.resizeOps[toolName] = resizeOps;
}

mfMathPaint.Modules.GeometricShapes.prototype.ButtonMainClicked = function()
{
}

mfMathPaint.Modules.GeometricShapes.prototype.ResetButtonIcons = function()
{
	for (var key in this.toolButtons)
	{
		this.toolButtons[key].SetActiveGraphic(key + '-off');
	}
	
	this.btMain.SetActiveGraphic('default');
}

mfMathPaint.Modules.GeometricShapes.prototype.ButtonMainReleased = function()
{
	this.ResetButtonIcons();
	this.host.ClearTopLayer();
	this.handleEvent = function(event) {};
}

mfMathPaint.Modules.GeometricShapes.prototype.handleEvent = function(event)
{
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleManipulateEvent = function(event)
{
	if (this.manip == '' && event.type == 'mousemove')
	{
		this.selectedPoint = false;
		
		this.host.ClearTopLayer();
		
		var ctx = this.host.ctxTop;
		
		ctx.lineWidth = 1.5;
		
		for (var objectId in this.pointCache)
		{
			for (var key in this.pointCache[objectId])
			{
				var pt = this.pointCache[objectId][key];
				var d = Math.sqrt(Math.pow(pt.x - event.pageX, 2) + Math.pow(pt.y - event.pageY, 2));
				
				if (!this.selectedPoint && d < 10)
				{
					this.selectedPoint = pt;
					ctx.strokeStyle = '#f00';
				}
				else
				{
					ctx.strokeStyle = '#00f';
				}
				
				ctx.beginPath();
				ctx.arc(pt.x, pt.y, 3, 0, 7, false);
				ctx.stroke();
			}
		}
	}
	else if (this.manip == '' && event.type == 'mousedown' && this.selectedPoint)
	{
		if (this.host.GetObjectInstructions(this.selectedPoint.id).length > 0)
		{
			this.mx = event.pageX;
			this.my = event.pageY;
			this.manip = 'move';
			
			this.selectedObject = this.objectCache[this.selectedPoint.id];
			this.host.DeleteObject(this.selectedPoint.id, true);
			this.host.Repaint();
			
			this.MovePoint(event, true);
		}
	}
	else if (this.manip == 'move' && event.type == 'mousemove')
	{
		this.MovePoint(event, true);
	}
	else if (this.manip == 'move' && event.type == 'mouseup')
	{
		this.MovePoint(event);
		
		var id = this.host.GetNextObjectId();
		
		for (var key in this.selectedObject)
		{
			var o = this.selectedObject[key];
			
			this.host.SendInstruction('GEOM', id, o.data1, o.data2, o.data3, o.data4, o.text);
			this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':'GEOM', 'objectId':id,
				'data1':o.data1, 'data2':o.data2, 'data3':o.data3, 'data4':o.data4, 'text':o.text});
		}
		
		this.host.ClearTopLayer();
		this.selectedPoint = false;
		this.selectedObject = false;
		this.manip = '';
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.MovePoint = function(event, moveBack)
{
	var o = this.selectedObject;
	
	if (this.selectedPoint.f)
	{
		this.selectedPoint.f(o, event.pageX - this.mx, event.pageY - this.my);
	}
	else
	{
		if (this.selectedPoint.tx != '')
		{
			var xfields = this.selectedPoint.tx.split(',');
			
			for (var n in xfields)
			{
				o[xfields[n].split('.')[0]][xfields[n].split('.')[1]] += (event.pageX - this.mx);
			}
		}
		
		if (this.selectedPoint.ty != '')
		{
			var yfields = this.selectedPoint.ty.split(',');
			
			for (var n in yfields)
			{
				o[yfields[n].split('.')[0]][yfields[n].split('.')[1]] += (event.pageY - this.my);
			}
		}
	}
	
	this.RenderManipulatedObject(o);
	
	if (moveBack)
	{
		if (this.selectedPoint.f)
		{
			this.selectedPoint.f(o, this.mx - event.pageX, this.my - event.pageY);
		}
		else
		{
			if (this.selectedPoint.tx != '')
			{
				var xfields = this.selectedPoint.tx.split(',');
				
				for (var n in xfields)
				{
					o[xfields[n].split('.')[0]][xfields[n].split('.')[1]] -= (event.pageX - this.mx);
				}
			}
			
			if (this.selectedPoint.ty != '')
			{
				var yfields = this.selectedPoint.ty.split(',');
				
				for (var n in yfields)
				{
					o[yfields[n].split('.')[0]][yfields[n].split('.')[1]] -= (event.pageY - this.my);
				}
			}
		}
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderManipulatedObject = function(o)
{
	this.host.ClearTopLayer();
	
	if (o[0].text == 'circle')
	{
		this.RenderCircle(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4, true);
	}
	else if (o[0].text == 'ellipse1')
	{
		this.RenderEllipse(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4, o[1].data1, o[1].data2);
	}
	else if (o[0].text == 'triangle1')
	{
		this.RenderTriangle(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4, o[1].data1, o[1].data2);
	}
	else if (o[0].text == 'righttriangle')
	{
		this.RenderRightTriangle(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4);
	}
	else if (o[0].text == 'ngon1')
	{
		this.RenderNgon(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4, o[1].data1);
	}
	else if (o[0].text == 'rectangle')
	{
		this.RenderRectangle(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4);
	}
	else if (o[0].text == 'rhombus')
	{
		this.RenderRhombus(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4);
	}
	else if (o[0].text == 'parallelogram1')
	{
		this.RenderParallelogram(this.host.ctxTop, o[0].data1, o[0].data2, o[0].data3, o[0].data4, o[1].data1, o[1].data2, o[1].data3, o[1].data4);
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.GetPaintEvent = function(event)
{
	var result = {'x1':0, 'y1':0, 'x2':0, 'y2':0, 'state':'none'};
	
	if (!this.painting && event.type == 'mousedown')
	{
		this.painting = true;
		this.mx = result.x1 = event.pageX;
		this.my = result.y1 = event.pageY;
		
		result.state = 'paintwait';
	}
	else if (this.painting && (event.type == 'mousemove' || event.type == 'mouseup'))
	{
		result.x1 = this.mx;
		result.y1 = this.my;
		result.x2 = event.pageX;
		result.y2 = event.pageY;
		
		if (event.type == 'mousemove')
		{
			result.state = (result.x2 == result.x1 || result.y2 == result.y1)
				? 'paintwait' : 'painting';
		}
		else
		{
			this.painting = false;
			
			result.state = (result.x2 == result.x1 || result.y2 == result.y1)
				? 'none' : 'commit';
		}
	}
	
	return result;
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleCircleEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderCircle(this.host.ctxTop, result.x1, result.y1, result.x2, result.y2, true);
	}
	else if (result.state == 'commit')
	{
		this.SendAndHandle('GEOM', this.host.GetNextObjectId(), result.x1, result.y1, result.x2, result.y2, 'circle');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleEllipseEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting' || result.state == 'commit')
	{
		var angle = Math.atan2(result.y2 - result.y1, result.x2 - result.x1);
		var x3 = result.x1 + 50 * Math.cos(angle + Math.PI / 2);
		var y3 = result.y1 + 50 * Math.sin(angle + Math.PI / 2);
		
		if (result.state == 'painting')
		{
			this.RenderEllipse(this.host.ctxTop, result.x1, result.y1, result.x2, result.y2, x3, y3);
		}
		else
		{
			var id = this.host.GetNextObjectId();
			this.SendAndHandle('GEOM', id, result.x1, result.y1, result.x2, result.y2, 'ellipse1');
			this.SendAndHandle('GEOM', id, x3, y3, 0, 0, 'ellipse2');
		}
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleTriangleEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderTriangle(this.host.ctxTop, result.x1, result.y1, result.x1 + 50, result.y1 + 50, result.x2, result.y2);
	}
	else if (result.state == 'commit')
	{
		var id = this.host.GetNextObjectId();
		this.SendAndHandle('GEOM', id, result.x1, result.y1, result.x1 + 50, result.y1 + 50, 'triangle1');
		this.SendAndHandle('GEOM', id, result.x2, result.y2, 0, 0, 'triangle2');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleRightTriangleEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderRightTriangle(this.host.ctxTop, result.x1, result.y1, result.x2, result.y2);
	}
	else if (result.state == 'commit')
	{
		this.SendAndHandle('GEOM', this.host.GetNextObjectId(), result.x1, result.y1, result.x2, result.y2, 'righttriangle');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleNgonEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderNgon(this.host.ctxTop, result.x1, result.y1, result.x2, result.y2, 5);
	}
	else if (result.state == 'commit')
	{
		var id = this.host.GetNextObjectId();
		this.SendAndHandle('GEOM', id, result.x1, result.y1, result.x2, result.y2, 'ngon1');
		this.SendAndHandle('GEOM', id, 5, 0, 0, 0, 'ngon2');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleRhombusEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderRhombus(this.host.ctxTop, result.x1, result.y1, result.x2, result.y2);
	}
	else if (result.state == 'commit')
	{
		this.SendAndHandle('GEOM', this.host.GetNextObjectId(), result.x1, result.y1, result.x2, result.y2, 'rhombus');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleRectangleEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderRectangle(this.host.ctxTop, result.x1, result.y1, result.x2, result.y2);
	}
	else if (result.state == 'commit')
	{
		this.SendAndHandle('GEOM', this.host.GetNextObjectId(), result.x1, result.y1, result.x2, result.y2, 'rectangle');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleParallelogramEvent = function(event)
{
	var result = this.GetPaintEvent(event);
	this.host.ClearTopLayer();
	
	if (result.state == 'painting')
	{
		this.RenderParallelogram(this.host.ctxTop, result.x1 + 30, result.y1, result.x2 + 30, result.y1, result.x2, result.y2, result.x1, result.y2);
	}
	else if (result.state == 'commit')
	{
		var id = this.host.GetNextObjectId();
		this.SendAndHandle('GEOM', id, result.x1 + 30, result.y1, result.x2 + 30, result.y1, 'parallelogram1');
		this.SendAndHandle('GEOM', id, result.x2, result.y2, result.x1, result.y2, 'parallelogram2');
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderCircle = function(ctx, x1, y1, x2, y2, showRadius)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.arc(x1, y1, Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)), 0, 7, false);
	ctx.stroke();
	
	if (showRadius !== true)
	{
		ctx.lineWidth = 1.0;
		ctx.strokeStyle = '#aaa';
	}
	
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderEllipse = function(ctx, x1, y1, x2, y2, x3, y3)
{
	var firstRadius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	var firstAngle = Math.atan2(y2 - y1, x2 - x1);
	
	var secondRadius = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));
	var secondAngle = firstAngle + Math.PI / 2;
	
	if (firstRadius >= secondRadius)
	{
		var majorRadius = firstRadius;
		var majorAngle = firstAngle;
		var minorRadius = secondRadius;
		var minorAngle = secondAngle;
	}
	else
	{
		var majorRadius = secondRadius;
		var majorAngle = secondAngle;
		var minorRadius = firstRadius;
		var minorAngle = firstAngle;
	}
	
	var a = majorRadius;
	var b = minorRadius;
	
	var px = 0;
	var py = 0;
	
	var ecc = Math.sqrt(a*a - b*b);
	
	ctx.lineWidth = 1.0;
	ctx.strokeStyle = '#aaa';
	ctx.beginPath();
	ctx.moveTo(x3, y3);
	ctx.lineTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();
	
	ctx.fillStyle = '#888';
	
	ctx.beginPath();
	ctx.arc(x1 + ecc * Math.cos(majorAngle), y1 + ecc * Math.sin(majorAngle), 4, 0, 7, false);
	ctx.fill();
	
	ctx.beginPath();
	ctx.arc(x1 + ecc * Math.cos(majorAngle + Math.PI), y1 + ecc * Math.sin(majorAngle + Math.PI), 4, 0, 7, false);
	ctx.fill();
	
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	
	for (var t = 0; t <= 7; t += 0.1)
	{
		px = x1 + a * Math.cos(t) * Math.cos(majorAngle) - b * Math.sin(t) * Math.sin(majorAngle);
		py = y1 + a * Math.cos(t) * Math.sin(majorAngle) + b * Math.sin(t) * Math.cos(majorAngle);
		
		if (t == 0)
		{
			ctx.moveTo(px, py);
		}
		else
		{
			ctx.lineTo(px, py);
		}
	}
	
	ctx.stroke();
}

// todo: replace with math
mfMathPaint.Modules.GeometricShapes.prototype.GetEllipseBoundingBox = function(x1, y1, x2, y2, x3, y3)
{
	var majorRadius = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	var majorAngle = Math.atan2(y2 - y1, x2 - x1);
	
	var minorRadius = Math.sqrt(Math.pow(x1 - x3, 2) + Math.pow(y1 - y3, 2));
	var minorAngle = majorAngle + Math.PI / 2;
	
	var xmin = Number.MAX_VALUE;
	var xmax = Number.MIN_VALUE;
	var ymin = Number.MAX_VALUE;
	var ymax = Number.MIN_VALUE;
	
	var a = majorRadius;
	var b = minorRadius;
	
	var px = 0;
	var py = 0;
	
	for (var t = 0; t <= 7; t += 0.1)
	{
		px = x1 + a * Math.cos(t) * Math.cos(majorAngle) - b * Math.sin(t) * Math.sin(majorAngle);
		py = y1 + a * Math.cos(t) * Math.sin(majorAngle) + b * Math.sin(t) * Math.cos(majorAngle);
		
		if (px < xmin)
		{
			xmin = px;
		}
		else if (px > xmax)
		{
			xmax = px;
		}
		
		if (py < ymin)
		{
			ymin = py;
		}
		else if (py > ymax)
		{
			ymax = py;
		}
	}
	
	return {'x': xmin, 'y': ymin, 'w': Math.abs(xmin - xmax), 'h': Math.abs(ymin - ymax)};
}

mfMathPaint.Modules.GeometricShapes.prototype.MoveEllipseMajor = function(o, dx, dy)
{
	o[0].data3 += dx;
	o[0].data4 += dy;
	
	var angle = Math.atan2(o[0].data4 - o[0].data2, o[0].data3 - o[0].data1);
	var minorRadius = Math.sqrt(Math.pow(o[0].data1 - o[1].data1, 2) + Math.pow(o[0].data2 - o[1].data2, 2));
	
	o[1].data1 = o[0].data1 + minorRadius * Math.cos(angle + Math.PI / 2);
	o[1].data2 = o[0].data2 + minorRadius * Math.sin(angle + Math.PI / 2);
}

mfMathPaint.Modules.GeometricShapes.prototype.MoveEllipseMinor = function(o, dx, dy)
{
	o[1].data1 += dx;
	o[1].data2 += dy;
	
	var angle = Math.atan2(o[1].data2 - o[0].data2, o[1].data1 - o[0].data1);
	var majorRadius = Math.sqrt(Math.pow(o[0].data1 - o[0].data3, 2) + Math.pow(o[0].data2 - o[0].data4, 2));
	
	o[0].data3 = o[0].data1 + majorRadius * Math.cos(angle - Math.PI / 2);
	o[0].data4 = o[0].data2 + majorRadius * Math.sin(angle - Math.PI / 2);
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderTriangle = function(ctx, x1, y1, x2, y2, x3, y3)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderRightTriangle = function(ctx, x1, y1, x2, y2)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x1, y2);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x1, y1);
	ctx.stroke();
	
	// draw the 90-degree marker square
	var amx = x1 + 10 * (x2 - x1) / Math.abs(x2 - x1);
	var amy = y2 - 10 * (y2 - y1) / Math.abs(y2 - y1);
	
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(x1, amy);
	ctx.lineTo(amx, amy);
	ctx.lineTo(amx, y2);
	ctx.stroke();
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderNgon = function(ctx, x1, y1, x2, y2, sides)
{
	var step = 2 * Math.PI / sides;
	
	var rad = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	
	var b = Math.atan2(y2-y1, x2-x1);
	
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	
	for (var a = 0; a <= 2 * Math.PI + 1; a += step)
	{
		if (a == 0)
		{
			ctx.moveTo(x1 + rad * Math.cos(a+b), y1 + rad * Math.sin(a+b));
		}
		else
		{
			ctx.lineTo(x1 + rad * Math.cos(a+b), y1 + rad * Math.sin(a+b));
		}
	}
	
	ctx.stroke();
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderRectangle = function(ctx, x1, y1, x2, y2)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.strokeRect(Math.min(x1, x2), Math.min(y1, y2), Math.abs(x2 - x1), Math.abs(y2 - y1));
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderParallelogram = function(ctx, x1, y1, x2, y2, x3, y3, x4, y4)
{
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.lineTo(x3, y3);
	ctx.lineTo(x4, y4);
	ctx.lineTo(x1, y1);
	ctx.stroke();
}

mfMathPaint.Modules.GeometricShapes.prototype.RenderRhombus = function(ctx, x1, y1, x2, y2)
{
	_x1 = Math.min(x1, x2);
	_y1 = Math.min(y1, y2);
	_x2 = Math.max(x1, x2);
	_y2 = Math.max(y1, y2);
	
	var cx = _x1 + Math.abs(_x1 - _x2) / 2;
	var cy = _y1 + Math.abs(_y1 - _y2) / 2;
	
	ctx.lineWidth = 1.5;
	ctx.strokeStyle = '#000';
	ctx.beginPath();
	ctx.moveTo(cx, _y1);
	ctx.lineTo(_x1, cy);
	ctx.lineTo(cx, _y2);
	ctx.lineTo(_x2, cy);
	ctx.lineTo(cx, _y1);
	ctx.stroke();
}

mfMathPaint.Modules.GeometricShapes.prototype.Clear = function()
{
	this.objectCache = {};
	this.pointCache = {};
	this.tmpObjects = {};
	
	this.host.ClearTopLayer();
}

mfMathPaint.Modules.GeometricShapes.prototype.OnObjectDeleted = function(data)
{
	delete this.objectCache[data[0].objectId];
	delete this.pointCache[data[0].objectId];
	delete this.tmpObjects[data[0].objectId];
}

mfMathPaint.Modules.GeometricShapes.prototype.HandleInstruction = function(instr)
{
	if (instr.text == 'circle')
	{
		var rad = Math.sqrt(Math.pow(instr.data1 - instr.data3, 2) + Math.pow(instr.data2 - instr.data4, 2));
		var o = new mfMathPaint.Object(instr.data1 - rad, instr.data2 - rad, 2 * rad, 2 * rad, 8);
		o.SetResizable(false);
		
		this.RenderCircle(o.image.getContext('2d'), rad, rad, rad + (instr.data3 - instr.data1), rad + (instr.data4 - instr.data2), false);
		this.host.AddObject(instr.objectId, o);
		
		this.objectCache[instr.objectId] = new Array(instr);
		this.pointCache[instr.objectId] = new Array(
			{'id':instr.objectId, 'x':instr.data1, 'y':instr.data2, 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'},
			{'id':instr.objectId, 'x':instr.data3, 'y':instr.data4, 'tx':'0.data3', 'ty':'0.data4'});
	}
	else if (instr.text == 'triangle1' || instr.text == 'triangle2')
	{
		var tmp = this.StoreTemporaryObject(instr);
		
		if (tmp['triangle1'] && tmp['triangle2'])
		{
			var t1 = tmp['triangle1'];
			var t2 = tmp['triangle2'];
			
			var xmin = Math.min(t1.data1, t1.data3, t2.data1);
			var xmax = Math.max(t1.data1, t1.data3, t2.data1);
			var ymin = Math.min(t1.data2, t1.data4, t2.data2);
			var ymax = Math.max(t1.data2, t1.data4, t2.data2);
			
			var o = new mfMathPaint.Object(xmin, ymin, xmax - xmin, ymax - ymin, 8);
			o.SetResizable(false);
			
			this.RenderTriangle(o.image.getContext('2d'), t1.data1 - xmin, t1.data2 - ymin, t1.data3 - xmin, t1.data4 - ymin, t2.data1 - xmin, t2.data2 - ymin);
			this.host.AddObject(instr.objectId, o);
			
			this.objectCache[instr.objectId] = new Array(t1, t2);
			this.pointCache[instr.objectId] = new Array(
				{'id':instr.objectId, 'x':t1.data1, 'y':t1.data2, 'tx':'0.data1', 'ty':'0.data2'},
				{'id':instr.objectId, 'x':t1.data3, 'y':t1.data4, 'tx':'0.data3', 'ty':'0.data4'},
				{'id':instr.objectId, 'x':t2.data1, 'y':t2.data2, 'tx':'1.data1', 'ty':'1.data2'},
				{'id':instr.objectId, 'x':o.x + o.width / 2, 'y':o.y + o.height / 2, 'tx':'0.data1,0.data3,1.data1', 'ty':'0.data2,0.data4,1.data2'});
			
			delete this.tmpObjects[instr.objectId];
		}
	}
	else if (instr.text == 'ngon1' || instr.text == 'ngon2')
	{
		var tmp = this.StoreTemporaryObject(instr);
		
		if (tmp['ngon1'] && tmp['ngon2'])
		{
			var n1 = tmp['ngon1'];
			var n2 = tmp['ngon2'];
			
			var rad = Math.sqrt(Math.pow(n1.data1 - n1.data3, 2) + Math.pow(n1.data2 - n1.data4, 2));
			var o = new mfMathPaint.Object(n1.data1 - rad, n1.data2 - rad, 2*rad, 2*rad, 8);
			o.SetResizable(false);
			o.SetHasPropertyEditor(true);
			
			this.RenderNgon(o.image.getContext('2d'), rad, rad, rad + n1.data3 - n1.data1, rad + n1.data4 - n1.data2, n2.data1);
			this.host.AddObject(instr.objectId, o);
			
			this.objectCache[instr.objectId] = new Array(n1, n2);
			this.pointCache[instr.objectId] = new Array(
				{'id':instr.objectId, 'x':n1.data1, 'y':n1.data2, 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'},
				{'id':instr.objectId, 'x':n1.data3, 'y':n1.data4, 'tx':'0.data3', 'ty':'0.data4'});
			
			delete this.tmpObjects[instr.objectId];
		}
	}
	else if (instr.text == 'righttriangle')
	{
		var xmin = Math.min(instr.data1, instr.data3);
		var xmax = Math.max(instr.data1, instr.data3);
		var ymin = Math.min(instr.data2, instr.data4);
		var ymax = Math.max(instr.data2, instr.data4);
		
		var o = new mfMathPaint.Object(xmin, ymin, xmax - xmin, ymax - ymin, 8);
		o.SetResizable(false);
		
		this.RenderRightTriangle(o.image.getContext('2d'), instr.data1 - xmin, instr.data2 - ymin, instr.data3 - xmin, instr.data4 - ymin);
		this.host.AddObject(instr.objectId, o);
		
		this.objectCache[instr.objectId] = new Array(instr);
		this.pointCache[instr.objectId] = new Array(
			{'id':instr.objectId, 'x':instr.data1, 'y':instr.data2, 'tx':'0.data1', 'ty':'0.data2'},
			{'id':instr.objectId, 'x':instr.data3, 'y':instr.data4, 'tx':'0.data3', 'ty':'0.data4'},
			{'id':instr.objectId, 'x':o.x + o.width / 3, 'y':o.y + o.height / 1.5, 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'});
	}
	else if (instr.text == 'rectangle')
	{
		var x1 = Math.min(instr.data1, instr.data3);
		var y1 = Math.min(instr.data2, instr.data4);
		var x2 = Math.max(instr.data1, instr.data3);
		var y2 = Math.max(instr.data2, instr.data4);
		
		var o = new mfMathPaint.Object(x1, y1, x2 - x1, y2 - y1, 8);
		o.SetOrigin(x1, y1);
		o.SetResizable(false);
		
		this.RenderRectangle(o.image.getContext('2d'), x1, y1, x2, y2);
		this.host.AddObject(instr.objectId, o);
		
		this.objectCache[instr.objectId] = new Array(instr);
		this.pointCache[instr.objectId] = new Array(
			{'id':instr.objectId, 'x':instr.data1 + ((instr.data3 - instr.data1) / 2), 'y':instr.data2 + ((instr.data4 - instr.data2) / 2), 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'},
			{'id':instr.objectId, 'x':instr.data1, 'y':instr.data2, 'tx':'0.data1', 'ty':'0.data2'},
			{'id':instr.objectId, 'x':instr.data3, 'y':instr.data2, 'tx':'0.data3', 'ty':'0.data2'},
			{'id':instr.objectId, 'x':instr.data1, 'y':instr.data4, 'tx':'0.data1', 'ty':'0.data4'},
			{'id':instr.objectId, 'x':instr.data3, 'y':instr.data4, 'tx':'0.data3', 'ty':'0.data4'});
	}
	else if (instr.text == 'ellipse1' || instr.text == 'ellipse2')
	{
		var tmp = this.StoreTemporaryObject(instr);
		
		if (tmp['ellipse1'] && tmp['ellipse2'])
		{
			var e1 = tmp['ellipse1'];
			var e2 = tmp['ellipse2'];
			
			var box = this.GetEllipseBoundingBox(e1.data1, e1.data2, e1.data3, e1.data4, e2.data1, e2.data2);
			var o = new mfMathPaint.Object(box.x, box.y, box.w, box.h, 8);
			o.SetResizable(false);
			
			var x = box.w / 2;
			var y = box.h / 2;
			
			this.RenderEllipse(o.image.getContext('2d'), x, y, x + (e1.data3 - e1.data1), y + (e1.data4 - e1.data2), x + (e2.data1 - e1.data1), y + (e2.data2 - e1.data2));
			this.host.AddObject(e1.objectId, o);
			
			this.objectCache[e1.objectId] = new Array(e1, e2);
			this.pointCache[instr.objectId] = new Array(
				{'id':e1.objectId, 'x':e1.data1, 'y':e1.data2, 'tx':'0.data1,0.data3,1.data1', 'ty':'0.data2,0.data4,1.data2'},
				{'id':e1.objectId, 'x':e1.data3, 'y':e1.data4, 'f':this.MoveEllipseMajor},
				{'id':e1.objectId, 'x':e2.data1, 'y':e2.data2, 'f':this.MoveEllipseMinor});
			
			delete this.tmpObjects[instr.objectId];
		}
	}
	else if (instr.text == 'rhombus')
	{
		var box = {'x':Math.min(instr.data1, instr.data3), 'y':Math.min(instr.data2, instr.data4),
			'w':Math.abs(instr.data1 - instr.data3), 'h':Math.abs(instr.data2 - instr.data4)};
		
		var o = new mfMathPaint.Object(box.x, box.y, box.w, box.h, 8);
		o.SetResizable(false);
		
		this.RenderRhombus(o.image.getContext('2d'), 0, 0, box.w, box.h);
		this.host.AddObject(instr.objectId, o);
		
		this.objectCache[instr.objectId] = new Array(instr);
		this.pointCache[instr.objectId] = new Array(
			{'id':instr.objectId, 'x':instr.data1 + box.w / 2, 'y':instr.data2, 'tx':'', 'ty':'0.data2'},
			{'id':instr.objectId, 'x':instr.data3 - box.w / 2, 'y':instr.data4, 'tx':'', 'ty':'0.data4'},
			{'id':instr.objectId, 'x':instr.data1, 'y':instr.data2 + box.h / 2, 'tx':'0.data1', 'ty':''},
			{'id':instr.objectId, 'x':instr.data3, 'y':instr.data2 + box.h / 2, 'tx':'0.data3', 'ty':''},
			{'id':instr.objectId, 'x':box.x + box.w / 2, 'y':box.y + box.h / 2, 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'});
	}
	else if (instr.text == 'parallelogram1' || instr.text == 'parallelogram2')
	{
		var tmp = this.StoreTemporaryObject(instr);
		
		if (tmp['parallelogram1'] && tmp['parallelogram2'])
		{
			var p1 = tmp['parallelogram1'];
			var p2 = tmp['parallelogram2'];
			
			var box = {'x':Math.min(p1.data1, p1.data3, p2.data1, p2.data3), 'y':Math.min(p1.data2, p1.data4, p2.data2, p2.data4)};
			box.w = Math.max(p1.data1, p1.data3, p2.data1, p2.data3) - box.x;
			box.h = Math.max(p1.data2, p1.data4, p2.data2, p2.data4) - box.y;
			
			var o = new mfMathPaint.Object(box.x, box.y, box.w, box.h, 8);
			o.SetResizable(false);
			
			this.RenderParallelogram(o.image.getContext('2d'),
				p1.data1 - box.x, p1.data2 - box.y, p1.data3 - box.x, p1.data4 - box.y,
				p2.data1 - box.x, p2.data2 - box.y, p2.data3 - box.x, p2.data4 - box.y);
			
			this.host.AddObject(instr.objectId, o);
			
			this.objectCache[instr.objectId] = new Array(p1, p2);
			this.pointCache[instr.objectId] = new Array(
				{'id':instr.objectId, 'x':p1.data1, 'y':p1.data2, 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'},
				{'id':instr.objectId, 'x':p1.data3, 'y':p1.data4, 'tx':'0.data1,0.data3', 'ty':'0.data2,0.data4'},
				{'id':instr.objectId, 'x':p2.data1, 'y':p2.data2, 'tx':'1.data1,1.data3', 'ty':'1.data2,1.data4'},
				{'id':instr.objectId, 'x':p2.data3, 'y':p2.data4, 'tx':'1.data1,1.data3', 'ty':'1.data2,1.data4'},
				{'id':instr.objectId, 'x':box.x + box.w / 2, 'y':box.y + box.h / 2, 'tx':'0.data1,0.data3,1.data1,1.data3', 'ty':'0.data2,0.data4,1.data2,1.data4'}
			);
			
			delete this.tmpObjects[instr.objectId];
		}
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.StoreTemporaryObject = function(instr)
{
	if (!(instr.objectId in this.tmpObjects))
	{
		this.tmpObjects[instr.objectId] = {};
	}
	
	this.tmpObjects[instr.objectId][instr.text] = instr;
	
	return this.tmpObjects[instr.objectId];
}

mfMathPaint.Modules.GeometricShapes.prototype.CommitMove = function(instructions, oldObject, dx, dy)
{
	var id = this.host.GetNextObjectId();
	var s = instructions;
	var toolName = new RegExp('[a-z]+').exec(s[0].text)[0];
	
	if (this.moveOps[toolName] !== undefined)
	{
		if (this.moveOps[toolName].dx !== undefined)
		{
			var xfields = this.moveOps[toolName].dx.split(',');
			
			for (var n in xfields)
			{
				s[xfields[n].split('.')[0]][xfields[n].split('.')[1]] += dx;
			}
		}
		
		if (this.moveOps[toolName].dy !== undefined)
		{
			var yfields = this.moveOps[toolName].dy.split(',');
			
			for (var n in yfields)
			{
				s[yfields[n].split('.')[0]][yfields[n].split('.')[1]] += dy;
			}
		}
	}
	
	for (var n in s)
	{
		this.SendAndHandle('GEOM', id, s[n].data1, s[n].data2, s[n].data3, s[n].data4, s[n].text);
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.CommitResize = function(instructions, oldObject, dx, dy)
{
}

mfMathPaint.Modules.GeometricShapes.prototype.ConfigurePropertiesEditor = function(editor, data)
{
	editor.AddProperty('objectId', data[0].objectId, true);
	
	if (data[0].text.substring(0, 4) == 'ngon')
	{
		editor.AddProperty('which', 'ngon', true);
		
		for (var n in data)
		{
			if (data[n].text == 'ngon2')
			{
				editor.AddProperty('Sides', data[n].data1);
			}
		}
	}
	
	editor.OnCommit = this.ApplyProperties.bind(this);
}

mfMathPaint.Modules.GeometricShapes.prototype.ApplyProperties = function(p)
{
	var data = this.host.GetObjectInstructions(p.objectId);
	var id = this.host.GetNextObjectId();
	this.host.DeleteObject(p.objectId, true);
	this.host.RepaintBottom();
	
	if (p.which == 'ngon')
	{
		var sides = Math.abs(parseInt(p.Sides));
		
		for (var n in data)
		{
			var d = data[n];
			
			if (d.text == 'ngon2' && sides >= 3)
			{
				d.data1 = sides;
			}
			
			this.SendAndHandle(d.instrName, id, d.data1, d.data2, d.data3, d.data4, d.text);
		}
	}
}

mfMathPaint.Modules.GeometricShapes.prototype.SendAndHandle = function(instrName, objectId, data1, data2, data3, data4, text)
{
	this.host.SendInstruction(instrName, objectId, data1, data2, data3, data4, text);
	this.HandleInstruction({'instrId':0, 'origin':0, 'instrName':instrName, 'objectId':objectId, 'data1':data1, 'data2':data2, 'data3':data3, 'data4':data4, 'text':text});
}
