<?php
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

/* List of illegal commands taken from MathTeX */
$illegal = array(
	'\newcommand', '\providecommand', '\renewcommand',
	'\input', '\def', '\edef', '\gdef', '\xdef', '\loop',
	'\csname', '\catcode', '\output', '\everycr', '\everypar',
	'\everymath', '\everyhbox', '\everyvbox', '\everyjob',
	'\openin', '\read', '\openout', '\write', '^^');

$input = base64_decode($_GET['latex']);
$tmpnam = tempnam('/tmp', 'latexphp');

if (str_replace($illegal, '', $input) === $input)
{
	$texdoc = '\documentclass{article}' . "\n";
	$texdoc .= '\pagestyle{empty}' . "\n";
	$texdoc .= '\usepackage{amsmath}' . "\n";
	$texdoc .= '\begin{document}' . "\n";
	$texdoc .= '\begin{displaymath}' . "\n";
	$texdoc .= base64_decode($_GET['latex']) . "\n";
	$texdoc .= '\end{displaymath}' . "\n";
	$texdoc .= '\end{document}' . "\n";

	file_put_contents($tmpnam . '.tex', $texdoc);

	exec('latex -output-format=dvi -output-directory=/tmp ' . $tmpnam . '.tex');
	exec('dvipng -bg Transparent -T tight -D 200 -o ' . $tmpnam . '.png ' . $tmpnam . '.dvi');
}

header('Content-Type: image/png');

if (file_exists($tmpnam . '.png'))
{
	$f = fopen($tmpnam . '.png', 'rb');
	header('Content-Length: ' . filesize($tmpnam . '.png'));
	fpassthru($f);
	fclose($f);
}
else
{
	$image = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAF0AAAAQCAYAAAB0t3NxAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gMHFwUsaFG4xQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAM1SURBVFjD7ZddaM9hFMc/05BtJpTXUUpKmDZ5KWooiwhp8pZSinnXJK0orsaICxe0i7kYoRFzoZC30LwuwpDXMXtDzMbMzM/N97eOX7/f/r8tahf/U/9+z3m+5znnec5znnPOH6IUpShF6b9TL+AB4Oj3BdjXDj19zfoXQLP4CqBM44IIOpKA12YvNcBSYcuA38AvIC/EOSq0j5/Ah47o+DgdyAHGtlPHbOCRdPUw+kYJPw1kh9DTA/iotbs8l1oDpLeyNtE4faTmVgFXO4KTO3n4VCAG+ArcDVgTC2wG3skp14ALwG7h44FDwHddXAzwDSgV/gN4onGGHPEKqASWGzu1QK6J7jhgGFAEzAXOt3KuMfrWGbvVsjtIke9oLgUo0b5Oh8BdSlAwvNRei4A+wsLqAGCTBC+2cqA8yWTKoQ/Fz/CRzRZ2xQfL0SuYrk26Kcn78qqEHZGtESGCaYvWXA7A04UXA+eASXJSVUg8VsHSqMBaIPmjbbDRQscluDNgs1OFXxffU7m1STfvpVOSzw049Fnxo8U/9tGxwaSKESFf8EkTZU+Bmx58rfBGINm8utSQeKanNg01tSesjRZ6I8F5AYcpFL5G/EJzm35ULjzDM39W86uBCSp8tYoGSzHAQV2sE7IWoNTnKA35Ub7wwnbixcIXi08RX9cGHX91HY6eux9VCh/nUZzjI9vf6BvswT5rvhS4BGwHevvUjgJgry7ZUQ3pHsHh/YzdAQEy94XPaideLzxF/CLxN9qgo6XrcORY20G8NHyjZIYqnXwKiGSAOT76MAXOdhYAXc24i1JElvjOpoXcGsHprt1yMzdEraNrp0n1JNFnfSQc01UNF39Y/IowOmz3MkXfO2ZuFXDb8M/1TQO2mS4kSXnZ0mR9S3w2fUzfjcBApRU3v8erE6hWlKMDnNA4S714ELl27b7XA/c0TtYreqMuzUuRcEyjkaY6N19dXH5YHd2Uo5o9f2reil9nZGfKGc+AieoSGsQvCdDXABzw2IwH9quS1wO3gGnqZNwU9t6kpdXal2OwhJDncOvKDsmtFH8mwKGRcDeFFcmhZcAeT9oLoyNKUYpSlP41/QE7lTKVsSAOHQAAAABJRU5ErkJggg==+xAmAAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAADWSURBVFjD7VVBDoQgDByIb+DG0Z/4GV7kZ/YnHrnxCfawaVJZEGqMHuwkHhhrKVOcAgqFQgFgA/LiXa7x5bN4l8/wPD9f215xwTvMgJkBQxxf0/tPTKaM53wL9g6FZ8CsMYHUCN6BCpt6H68xAUAe3Yzi+SZUxBbTH3+qBSPxpfR0clLi1hZw2Xk7di0opQ7eAT9OhKvyvNCIrjIcCb+7hC0Daf0FV/H2afWnnoG0jOisQYmH0dEwORoytbjaPlbq5SO8JI/lEtVuqbQInkdyGIVC8V58Adgp/hrFcW30AAAAAElFTkSuQmCC+xUKksk3pOAGVlrrfLkgjy8LsFLNQt6R+G+leJoUIegfF4i6DiPn8DriuKOnt4+csQxpA9+0Z5jRh9/U6/DoE9zwDtsuhU0xrGkL5JsOxj6uipmDpJOdVHv4OkiomSb9rdUuINsmza4Qpf8D+vadUV8zuHNqjfn2GgClwN7TcA7sN0zpAORnmEc2KaTDkTojANB+tKBON12IIVuOJBFnzm+Bq+SMQg3KP376foN+CKd8bbbxvQAAAAASUVORK5CYII=');
	header('Content-Length: ' . strlen($image));
	echo $image;
	exit();
}
