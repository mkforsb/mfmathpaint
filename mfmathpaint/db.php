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

require 'db_config.php';

class mfMathPaintDbInterface
{
	const OPT_COMPACT = 1;
	const OPT_JSON = 2;
	
	public function __construct($options=0)
	{
		$this->options = $options;
		
		$this->link = new PDO('mysql:dbname=' . MFMATHPAINT_DB_DBNAME . ';host=' .
			MFMATHPAINT_DB_HOST, MFMATHPAINT_DB_USER, MFMATHPAINT_DB_PASS, array(PDO::ATTR_PERSISTENT));
		
		$this->link->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		
		$this->stmt_ccnt_get = $this->link->prepare('
			SELECT `data1` FROM `data` WHERE `instr`=\'CCNT\'');
		
		$this->stmt_ccnt_update = $this->link->prepare('
			UPDATE `data` SET `data1`=:count WHERE `instr`=\'CCNT\'');
		
		$this->stmt_read = $this->link->prepare('
			SELECT `instr_id`, `origin`, `instr`, `obj_id`, `data1`, `data2`, `data3`, `data4`, `text`
			FROM `data`
			WHERE `instr_id` >= :offset
			LIMIT 0, :limit');
		
		$this->stmt_post = $this->link->prepare('
			INSERT INTO `data` (`instr`, `origin`, `obj_id`, `data1`, `data2`, `data3`, `data4`, `text`)
			VALUES (:instr, :origin, :obj_id, :data1, :data2, :data3, :data4, :text)');
		
		$this->stmt_post_with_ttl = $this->link->prepare('
			INSERT INTO `data` (`instr`, `origin`, `obj_id`, `data1`, `data2`, `data3`, `data4`, `text`, `ttl`)
			VALUES (:instr, :origin, :obj_id, :data1, :data2, :data3, :data4, :text, :ttl)');
		
		$this->stmt_del_ttl = $this->link->prepare('
			DELETE FROM `data` WHERE `ttl` IS NOT NULL AND `ttl` < :val');
		
		$this->stmt_del_instr = $this->link->prepare('
			DELETE FROM `data` WHERE `instr_id` = :instr_id');
		
		$this->stmt_del_instr_range = $this->link->prepare('
			DELETE FROM `data` WHERE `instr_id` >= :instr_id_from AND `instr_id` <= :instr_id_to');
		
		$this->stmt_del_obj = $this->link->prepare('
			DELETE FROM `data` WHERE `obj_id` = :obj_id');
		
		$this->stmt_clear = $this->link->prepare('
			TRUNCATE TABLE `data`;
			INSERT INTO `data` (`origin`, `instr`, `data1`)
			VALUES (:origin, \'START\', :starting_tag)');
		
		$this->stmt_del_ttl->execute(array('val' => time()));
	}
	
	public function parseRequest($request)
	{
		$this->link->beginTransaction();
		
		$reqs = explode('|', $request);
		
		foreach ($reqs as $req)
		{
			$req = explode(',', $req);
			
			switch ($req[0])
			{
				case 'hello':
					$result = $this->makeClientId();
					$this->link->commit();
					return $result;
					break;
				
				case 'read':
					return $this->read($req[1], $req[2]);
					break;
				
				case 'post':
					$data = array_slice($req, 1);
					
					if (sizeof($data) === 8)
					{
						$this->post($data[0], $data[1], $data[2], $data[3], $data[4], $data[5], 
							$data[6], $data[7]);
					}
					
					break;
				
				case 'idel':
					$range = -1;
					
					if (isset($req[3]))
					{
						$range = $req[3];
					}
					
					$this->deleteInstruction($req[1],  $req[2], $range);
					break;
				
				case 'odel':
					$this->deleteObject($req[1],  $req[2]);
					break;
				
				case 'clear':
					$this->clear($req[1], $req[2]);
				
				default:
					break;
			}
		}
		
		$this->link->commit();
	}
	
	public function makeClientId()
	{
		$this->stmt_ccnt_get->execute();
		$result = $this->stmt_ccnt_get->fetchAll(PDO::FETCH_NUM);
		
		if (sizeof($result) == 0)
		{
			$this->stmt_post->execute(array(
				'instr' => 'CCNT', 'origin' => 0, 'obj_id' => 0, 'data1' => 0,
				'data2' => 0, 'data3' => 0, 'data4' => 0, 'text' => ''));
			
			return 1000;
		}
		else
		{
			$count = (int)$result[0][0] + 1;
			
			$this->stmt_ccnt_update->execute(array('count' => $count));
			
			return 1000 + $count;
		}
	}
	
	public function read($offset=0, $limit=100)
	{
		$offset = (int)$offset;
		$limit = (int)$limit;
		
		$offset += 1;
		
		$this->stmt_read->bindParam('offset', $offset, PDO::PARAM_INT);
		$this->stmt_read->bindParam('limit', $limit, PDO::PARAM_INT);
		$this->stmt_read->execute();
		
		$result = $this->stmt_read->fetchAll(PDO::FETCH_NUM);
		
		if ($this->options & self::OPT_COMPACT)
		{
			$result = array_map('array_values', $result);
		}
		
		if ($this->options && self::OPT_JSON)
		{
			$result = json_encode($result);
		}
		
		return $result;
	}
	
	public function post($instr, $origin, $obj_id, $data1, $data2, $data3, $data4, $text)
	{
		if ($instr === 'CLEAR')
		{
			$this->stmt_post_with_ttl->execute(array(
				'instr' => $instr, 'origin' => (int)$origin, 'obj_id' => (int)$obj_id, 'data1' => (int)$data1,
				'data2' => (int)$data2, 'data3' => (int)$data3, 'data4' => (int)$data4,
				'text' => $text, 'ttl' => time() + 5));
		}
		else
		{
			$this->stmt_post->execute(array(
				'instr' => $instr, 'origin' => (int)$origin, 'obj_id' => (int)$obj_id, 'data1' => (int)$data1,
				'data2' => (int)$data2, 'data3' => (int)$data3, 'data4' => (int)$data4,
				'text' => $text));
		}
	}
	
	public function deleteInstruction($origin, $instr_id, $range)
	{
		if ($range !== -1)
		{
			$this->stmt_del_instr_range->execute(array(
				'instr_id_from' => (int)$instr_id, 'instr_id_to' => (int)$range));
			
			$this->stmt_post_with_ttl->execute(array(
				'instr' => 'IDEL', 'origin' => (int)$origin, 'obj_id' => 0, 'data1' => (int)$instr_id,
				'data2' => $range, 'data3' => 0, 'data4' => 0,
				'text' => '', 'ttl' => time() + 5));
		}
		else
		{
			$this->stmt_del_instr->execute(array(
				'instr_id' => (int)$instr_id));
			
			$this->stmt_post_with_ttl->execute(array(
				'instr' => 'IDEL', 'origin' => (int)$origin, 'obj_id' => 0, 'data1' => (int)$instr_id,
				'data2' => 0, 'data3' => 0, 'data4' => 0,
				'text' => '', 'ttl' => time() + 5));
		}
	}
	
	public function deleteObject($obj_id, $origin)
	{
		$this->stmt_del_obj->execute(array(
			'obj_id' => (int)$obj_id));
		
		$this->stmt_post_with_ttl->execute(array(
			'instr' => 'ODEL', 'origin' => (int)$origin, 'obj_id' => 0, 'data1' => (int)$obj_id,
			'data2' => 0, 'data3' => 0, 'data4' => 0,
			'text' => '', 'ttl' => time() + 5));
	}
	
	public function clear($origin, $starting_tag)
	{
		$this->stmt_clear->execute(array(
			'origin' => (int)$origin, 'starting_tag' => (int)$starting_tag));
	}
	
	private 
		$options,
		$link,
		$stmt_ccnt_get,
		$stmt_ccnt_update,
		$stmt_read,
		$stmt_post,
		$stmt_post_with_ttl,
		$stmt_del_ttl,
		$stmt_del_instr,
		$stmt_del_instr_range,
		$stmt_del_obj,
		$stmt_clear;
}

$dbi = new mfMathPaintDbInterface(mfMathPaintDbInterface::OPT_COMPACT | mfMathPaintDbInterface::OPT_JSON);

if (isset($_POST['do']))
{
	echo $dbi->parseRequest($_POST['do']);
}
else if (isset($_GET['do']))
{
	echo $dbi->parseRequest($_GET['do']);
}
