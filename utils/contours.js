					interpolatedZero = function(f1, f2)
					{
						if(abs(f1 - f2) < 0.001)
						{
							return 1;
						}
						return (-f2 / (f1 - f2));
					}

					locateZero = function(f1, f2, pos1x, pos1y, pos2x, pos2y)
					{
						var a = interpolatedZero(f1, f2);
						var pt = [a*pos1x+(1-a)*pos2x, a*pos1y+(1-a)*pos2y];
						return pt;
					}

					drawContourInTriangle = function(ffnc, level, x, y, stepsize)
					{
						level = level + 0.000000001;
						var dx = stepsize / 2;
						var dy = stepsize / 2;
						var x1 = x;
						var x2 = x + 2*dx;
						var x3 = x;
						var y1 = y;
						var y2 = y;
						var y3 = y + 2*dy;

						f1 = ffnc(x1, y1) - level;
						f2 = ffnc(x2, y2) - level;
						f3 = ffnc(x3, y3) - level;
						var pt12 = locateZero(f1, f2, x1, y1, x2, y2);
						var pt13 = locateZero(f1, f3, x1, y1, x3, y3);
						var pt23 = locateZero(f2, f3, x2, y2, x3, y3);
						//if(f1 &lt; 0 && f2 &lt; 0 && f3 &lt; 0)
	                	//    line(pt12, pt23);
						if(f1 &lt; 0 && f2 &lt; 0 && f3 &gt; 0)
	                	    line(pt13, pt23);
						if(f1 &lt; 0 && f2 &gt; 0 && f3 &lt; 0)
	                	    line(pt12, pt23);
						if(f1 &lt; 0 && f2 &gt; 0 && f3 &gt; 0)
	                	    line(pt12, pt13);
						if(f1 &gt; 0 && f2 &lt; 0 && f3 &lt; 0)
	                	    line(pt12, pt13);
						if(f1 &gt; 0 && f2 &lt; 0 && f3 &gt; 0)
	                	    line(pt12, pt23);
						if(f1 &gt; 0 && f2 &gt; 0 && f3 &lt; 0)
	                	    line(pt13, pt23);
						//if(f1 &gt; 0 && f2 &gt; 0 && f3 &gt; 0)
	                	//    line(pt12, pt23);
					
						x1 = x + 2*dx;
						x2 = x + 2*dx;
						x3 = x;
						y1 = y + 2*dy;
						y2 = y;
						y3 = y + 2*dy;

						f1 = ffnc(x1, y1) - level;
						f2 = ffnc(x2, y2) - level;
						f3 = ffnc(x3, y3) - level;
						pt12 = locateZero(f1, f2, x1, y1, x2, y2);
						pt13 = locateZero(f1, f3, x1, y1, x3, y3);
						pt23 = locateZero(f2, f3, x2, y2, x3, y3);
						//if(f1 &lt; 0 && f2 &lt; 0 && f3 &lt; 0)
	                	//    line(pt12, pt23);
						if(f1 &lt; 0 && f2 &lt; 0 && f3 &gt; 0)
	                	    line(pt13, pt23);
						if(f1 &lt; 0 && f2 &gt; 0 && f3 &lt; 0)
	                	    line(pt12, pt23);
						if(f1 &lt; 0 && f2 &gt; 0 && f3 &gt; 0)
	                	    line(pt12, pt13);
						if(f1 &gt; 0 && f2 &lt; 0 && f3 &lt; 0)
	                	    line(pt12, pt13);
						if(f1 &gt; 0 && f2 &lt; 0 && f3 &gt; 0)
	                	    line(pt12, pt23);
						if(f1 &gt; 0 && f2 &gt; 0 && f3 &lt; 0)
	                	    line(pt13, pt23);
						//if(f1 &gt; 0 && f2 &gt; 0 && f3 &gt; 0)
	                	//    line(pt12, pt23);
					}
						
					drawContours = function(ffnc, threshold, xlow, xhigh, ylow, yhigh, stepsize)
					{
						for(var xx = xlow; xx &lt;= xhigh; xx += stepsize)
						{
							for(var yy = 0; yy &lt;= 10; yy += stepsize)
							{
								drawContourInTriangle(fnc, threshold, xx, yy, stepsize);
							}
						}
					}

