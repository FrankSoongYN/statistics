package com.frank.statistics.util;
import java.io.Serializable;
import java.util.Iterator;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

/**
 * PageFactory
 * 
 * @author 
 * 
 */
public abstract class PageFactory {

	/**
	 * 创建Page对象
	 * 
	 * @param content
	 *            记录集合
	 * @param pageable
	 *            分页相关参数
	 * @param total
	 *            总记录数
	 * @return
	 */
	public static <T> Page<T> createPage(List<T> content, Pageable pageable, long total) {
		return adjustToOneIndexed(new PageImpl<T>(content, pageable, total));
	}

	/**
	 * 创建Page对象
	 * 
	 * @param content
	 *            记录集合
	 * @return
	 */
	public static <T> Page<T> createPage(List<T> content) {
		return adjustToOneIndexed(new PageImpl<T>(content));
	}

	/**
	 * 将spring-data项目相关API创建的页码基于0的Page对象，转换成页码基于1的Page对象
	 * 
	 * @param page
	 *            页码基于0的page对象
	 * @return 页码基于1的page对象
	 */
	public static <T> Page<T> adjustToOneIndexed(Page<T> page) {
		return new PageResult<T>(page);
	}

	/**
	 * 分页结果,{@link Page}的实现类
	 * 
	 * @author Erich
	 * 
	 * @param <T>
	 */
	private static class PageResult<T> implements Page<T>, Serializable {

		private static final long serialVersionUID = 2301792935925181685L;

		private Page<T> page;

		public PageResult(Page<T> page) {
			this.page = page;
		}

		public final int getNumber() {
			// 实际分页的总页数
			int totalPages = page.getTotalPages();
			// 期望的当前页码
			int number = page.getNumber() + 1;
			// 期望的当前页码超过实际分页的总页数的情况
			if (number > totalPages) {
				return totalPages;
			}
			return number;
		}

		public int getSize() {
			return page.getSize();
		}

		public int getTotalPages() {
			return page.getTotalPages();
		}

		public int getNumberOfElements() {
			return page.getNumberOfElements();
		}

		public long getTotalElements() {
			return page.getTotalElements();
		}

		public boolean hasPreviousPage() {
			return !isFirstPage() && getNumber() > 0;
		}

		public boolean isFirstPage() {
			return getNumber() == 1;
		}

		public boolean hasNextPage() {
			return page.hasNextPage();
		}

		public boolean isLastPage() {
			/*if (page.getTotalPages() <= 0) {
				return false;
			}*/
			return page.isLastPage();
		}

		public Iterator<T> iterator() {
			return page.iterator();
		}

		public List<T> getContent() {
			return page.getContent();
		}

		public boolean hasContent() {
			return page.hasContent();
		}

		public Sort getSort() {
			return page.getSort();
		}

	}

}
